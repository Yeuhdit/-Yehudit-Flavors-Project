// node-server/models/recipe.model.js
import mongoose from "mongoose";
import Joi from "joi"; // ולידציה
import { userSchema } from "./user.model.js";

// ✨ סכימה מקוצרת למשתמש שיוצר את המתכון
const miniUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    get: (v) => v.toUpperCase(),
  },
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
});

// סכימת מתכון מלאה
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: [{ type: String, required: true }],
  preparationTime: { type: Number },
  difficulty: { type: Number, min: 1, max: 5 },
  dateAdded: { type: Date, default: Date.now },
  layersArray: [
    {
      description: { type: String },
      ingredients: [{ type: String }],
    },
  ],
  preparationInstruction: {
    type: [String],
    validate: {
      validator(v) {
        return v && v.length >= 1;
      },
      message: "Preparation instructions must contain at least one step",
    },
  },
  imageUrl: { type: String },
  isPrivate: { type: Boolean, default: false },
  user: miniUserSchema,
});

// מודל mongoose
export const Recipes = mongoose.model("recipes", recipeSchema);

// Joi validation
export const recipesJoi = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    categories: Joi.array().items(Joi.string()).min(1).required(),
    preparationTime: Joi.number().optional(),
    difficulty: Joi.number().min(1).max(5).optional(),
    layersArray: Joi.array().items(
      Joi.object({
        description: Joi.string().optional(),
        ingredients: Joi.array().items(Joi.string()).optional(),
      })
    ).optional(),
    preparationInstruction: Joi.array().items(Joi.string()).min(1).required(),
    imageUrl: Joi.string().uri().optional(),
    isPrivate: Joi.boolean().optional(),
    user: Joi.object({
      name: Joi.string().required(),
      _id: Joi.string().required()
    }).required()
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    preparationTime: Joi.number().optional(),
    difficulty: Joi.number().min(1).max(5).optional(),
    layersArray: Joi.array().items(
      Joi.object({
        description: Joi.string().optional(),
        ingredients: Joi.array().items(Joi.string()).optional(),
      })
    ).optional(),
    preparationInstruction: Joi.array().items(Joi.string()).min(1).optional(),
    imageUrl: Joi.string().uri().optional(),
    isPrivate: Joi.boolean().optional(),
    user: Joi.object({
      name: Joi.string().optional(),
      _id: Joi.string().optional()
    }).optional()
  })
};


//המודל הזה מייצג מתכון מלא – כל המידע עליו נשמר כאן: