// node-server/models/categories.model.js
import mongoose from 'mongoose';
import Joi from 'joi';
import { Recipes } from './recipe.model.js';

const recipesMiniSchema = new mongoose.Schema({
  name: { type: String },
  imagUrl: { type: String },
  difficulty: { type: Number, min: 1, max: 5 },
  preparationTime: { type: Number },
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipes' }
});

const categoriesSchema = new mongoose.Schema({
  description: { type: String },
  recipes: [recipesMiniSchema]
});

// מודל mongoose
export const Categories = mongoose.model('Categories', categoriesSchema);

// Joi validation
export const categoriesJoi = {
  create: Joi.object({
    description: Joi.string().required().min(2),
    recipes: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        imagUrl: Joi.string().uri().optional(),
        difficulty: Joi.number().min(1).max(5).optional(),
        preparationTime: Joi.number().optional(),
        _id: Joi.string().required()
      })
    ).optional()
  }),
  update: Joi.object({
    description: Joi.string().min(2).optional(),
    recipes: Joi.array().items(
      Joi.object({
        name: Joi.string().optional(),
        imagUrl: Joi.string().uri().optional(),
        difficulty: Joi.number().min(1).max(5).optional(),
        preparationTime: Joi.number().optional(),
        _id: Joi.string().optional()
      })
    ).optional()
  })
};
