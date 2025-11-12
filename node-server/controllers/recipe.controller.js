// node-server/controllers/recipe.controller.js
import { Recipes } from "../models/recipe.model.js";
import { Categories } from "../models/categories.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Joi from "joi";

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './images'),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb('Error: Images only!');
  }
}).single('image');

// --- JOI schemas ---
const recipeSchema = Joi.object({
  name: Joi.string().min(1).required(),
  preparationTime: Joi.number().required(),
  difficulty: Joi.string().valid('easy','medium','hard').required(),
  categories: Joi.array().items(Joi.string()),
  isPrivate: Joi.boolean()
});

// --- Controllers ---
export const getAllRecipes = async (req, res, next) => {
  let { search = '', page = 1, perPage = 3 } = req.query;

//אלה הפרמטרים (הערכים) שאתה מעביר ל־RegExp:
// search → זה משתנה שמכיל את מה שהמשתמש חיפש (למשל "pizza").
// 'i' → זה דגל שאומר “תתעלם מגודל האותיות” (לא משנה אם זה PIZZA או pizza).
  try {
    const query = [{ name: new RegExp(search, 'i'), isPrivate: false }];
    if (req.user) query.push({ 'user._id': req.user.user_id, isPrivate: true });

    const recipes = await Recipes.find({ $or: query }).select('-__v');
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

export const getRecipeByCode = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next({ message: 'id is not valid', status: 404 });

  try {
    const recipe = await Recipes.findById(id).select('-__v');
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const getRecipesByUser = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const recipes = await Recipes.find({ 'user._id': id }).select('-__v');
    res.status(200).json(recipes);
  } catch (err) {
    next({ message: err.message, status: 404 });
  }
};

export const getRecipesByPreparationTime = async (req, res, next) => {
  const { preparationTime } = req.params;
  try {
    const recipes = await Recipes.find({ preparationTime }).select('-__v');
    res.status(200).json(recipes);
  } catch (err) {
    next({ message: err.message, status: 404 });
  }
};

// --- Add Recipe ---
export const addRecipe = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });

    let { categories } = req.body;
    if (typeof categories === 'string') categories = [categories];

    const { error } = recipeSchema.validate({ ...req.body, categories });
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      if (!['admin','user','registered user'].includes(req.user.role))
        return next({ message: 'only admin or registered user can add recipe', status: 403 });

      const recipe = new Recipes(req.body);
      const user = await User.findById(req.user.user_id);
      recipe.user = { name: user.username, _id: user._id };
      if (req.file) recipe.imagUrl = req.file.filename;

      await recipe.save();

      if (categories) {
        for (const catName of categories) {
          let cat = await Categories.findOne({ description: catName });
          if (!cat) {
            cat = new Categories({
              description: catName,
              recipes: [{
                name: recipe.name,
                imagUrl: recipe.imagUrl,
                difficulty: recipe.difficulty,
                preparationTime: recipe.preparationTime,
                _id: recipe._id
              }]
            });
            await cat.save();
          } else {
            cat.recipes.push(recipe);
            await cat.save();
          }
        }
      }

      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  });
};

// --- Update Recipe ---
export const updateRecipes = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });

    let { categories } = req.body;
    if (typeof categories === 'string') categories = [categories];

    const { error } = recipeSchema.validate({ ...req.body, categories });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return next({ message: 'id is not valid' });

    try {
      if (!['admin','user','registered user'].includes(req.user.role))
        return next({ message: 'only admin or registered user can update recipe', status: 403 });

      const prevRecipe = await Recipes.findById(id);
      if (!prevRecipe) return next({ message: 'recipe not found' });

      if (req.file) req.body.imagUrl = req.file.filename;

      const updatedRecipe = await Recipes.findByIdAndUpdate(id, { $set: req.body }, { new: true });

      // Remove recipe from previous categories if not in new categories
      for (let catName of prevRecipe.categories || []) {
        if (!categories.includes(catName)) {
          const cat = await Categories.findOne({ description: catName });
          if (cat) {
            cat.recipes = cat.recipes.filter(x => x._id.toString() !== id);
            if (!cat.recipes.length) await Categories.findByIdAndDelete(cat._id);
            else await cat.save();
          }
        }
      }

      // Add recipe to new categories
      for (let catName of categories) {
        let cat = await Categories.findOne({ description: catName });
        if (!cat) {
          cat = new Categories({
            description: catName,
            recipes: [{
              name: updatedRecipe.name,
              imagUrl: updatedRecipe.imagUrl,
              difficulty: updatedRecipe.difficulty,
              preparationTime: updatedRecipe.preparationTime,
              _id: updatedRecipe._id
            }]
          });
          await cat.save();
        } else {
          const index = cat.recipes.findIndex(x => x._id.toString() === id);
          if (index >= 0) cat.recipes[index] = updatedRecipe;
          else cat.recipes.push(updatedRecipe);
          await cat.save();
        }
      }

      res.json(updatedRecipe);
    } catch (err) {
      next(err);
    }
  });
};

// --- Delete Recipe ---
export const deleteRecipe = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return next({ message: 'id is not valid' });

  try {
    if (!['admin','user','registered user'].includes(req.user.role))
      return next({ message: 'only admin or registered user can delete recipe', status: 403 });

    const recipe = await Recipes.findById(id);
    if (!recipe) return next({ message: 'recipe not found' });

    // Remove recipe from categories
    for (let catName of recipe.categories || []) {
      const cat = await Categories.findOne({ description: catName });
      if (cat) {
        cat.recipes = cat.recipes.filter(x => x._id.toString() !== id);
        if (!cat.recipes.length) await Categories.findByIdAndDelete(cat._id);
        else await cat.save();
      }
    }

    await Recipes.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
// פונקציות עיקריות (Controllers):

// 📋 getAllRecipes – מחזיר את כל המתכונים.

// 🔍 getRecipeByCode – מחזיר מתכון לפי מזהה.

// 👤 getRecipesByUser – מחזיר מתכונים של משתמש מסוים.

// ⏱ getRecipesByPreparationTime – מחזיר מתכונים לפי זמן הכנה.

// ➕ addRecipe – מוסיף מתכון חדש + שומר קטגוריות חדשות.

// ✏️ updateRecipes – מעדכן מתכון קיים.

// ❌ deleteRecipe – מוחק מתכון וגם מסיר אותו מהקטגוריות.

//הדף הזה מטפל בכל הפעולות על מתכונים – יצירה, קריאה, עדכון ומחיקה.
// הוא גם בודק שהנתונים תקינים ושומר על הרשאות המשתמש לפני פעולה במסד הנתונים.