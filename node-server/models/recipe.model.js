// 🧠 ייבוא ספריות חיצוניות
import mongoose from "mongoose";
import Joi from "joi"; // אם תשתמשי בולידציה בהמשך
import { userSchema } from "./user.model.js";

// ✨ סכימה מקוצרת למשתמש שיוצר את המתכון
const miniUserSchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
    get: (v) => v.toUpperCase(),
},
_id:{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
},
});
 const recipeSchema=new mongoose.Schema({
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

export const Recipes = mongoose.model("recipes", recipeSchema);


//המודל הזה מייצג מתכון מלא – כל המידע עליו נשמר כאן: