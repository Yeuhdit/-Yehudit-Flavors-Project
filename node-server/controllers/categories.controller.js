// node-server/controllers/categories.controller.js
import mongoose from 'mongoose';
import { Categories } from '../models/categories.model.js';
import { Recipes } from '../models/recipe.model.js';
import Joi from 'joi';

// .hex() – מוודא שהמחרוזת מכילה תווים הקסדצימליים בלבד (0-9, a-f).
// .length(24) – המחרוזת חייבת להיות באורך בדיוק 24 תווים (כי זה אורך של ObjectId במונגו).
// --- SCHEMAS VALIDATION עם Joi ---
const categoryIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// --- פונקציות CONTROLLER ---
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find().select('-__v');
    return res.send(categories);
  } catch (error) {
    next({ message: error.message });
  }
};

export const getAllCategoriesAndRecipe = async (req, res, next) => {
  try {
    const categoriesAndRecipe = await Categories.find()
    //1️⃣ .populate

// פונקציה של Mongoose (ספרייה של MongoDB).

// אומרת: "תמלא את השדות האלה בפרטים האמיתיים שלהם" במקום רק לשים ID.

// בלי זה, השדה של המתכונים יהיה רק מספר זיהוי (_id) של המתכון.
//.populate('recipes._id') אומר:

// "תשנה כל מזהה של מתכון (_id) בתוך recipes לפרטים המלאים של אותו מתכון מהטבלה/אוסף Recipes."
      .populate('recipes._id')
      .select('-__v');
    return res.send(categoriesAndRecipe);
  } catch (error) {
    next({ message: error.message });
  }
};

export const getCategoryByIdWithRec = async (req, res, next) => {
  try {
    const { error } = categoryIdSchema.validate(req.params);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { id } = req.params;
    const recipesByCategory = await Categories.findById(id).select('-__v');
    if (!recipesByCategory) return res.status(404).send({ message: 'Category not found' });

    return res.send(recipesByCategory);
  } catch (error) {
    next({ message: error.message });
  }
};


//התפקיד  של הקובץ: controllers
//קובץ שמכיל פונקציות לטיפול בבקשות הקשורות לקטגוריות
//כמו קבלת כל הקטגוריות, קבלת קטגוריה לפי ID כולל מתכונים וכו'.
//מנהל את כל הפעולות של "קטגוריות" בצד השרת.