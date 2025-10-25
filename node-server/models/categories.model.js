//node-server/models/categories.model.js    
import mongoose from 'mongoose';    
import { Recipes } from './recipe.model.js'; 
const recipesMiniSchema=new mongoose.Schema({
  name: { 
    type: String 
},
  imagUrl: {
     type: String 
    },
  difficulty: { 
    type: Number, min: 1, max: 5 
},
  preparationTime: { 
    type: Number 
},
  _id: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Recipes' } // reference ל-Recipes
});
const categoriesSchema = new mongoose.Schema({
  description: { type: String }, 
  recipes: [recipesMiniSchema] 
});
export const Categories = mongoose.model('Categories', categoriesSchema);
