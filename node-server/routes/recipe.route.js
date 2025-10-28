// node-server/routes/recipe.route.js
import express from 'express';
import { 
    getAllRecipes,
    getRecipeByCode,
    getRecipesByPreparationTime,
    getRecipesByUser,
    addRecipe,
    updateRecipes,
    deleteRecipe
} from '../controllers/recipe.controller.js';
import { userAuth, getAuth } from '../middlewares/userAuth.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

router.get('/getallrecipes', getAuth, getAllRecipes);
router.get('/getRecipeByCode/:id', getRecipeByCode);
router.get('/getRecipesByPreparationTime/:preparationTime', getRecipesByPreparationTime);
router.get('/getRecipesByUser/:userId', getRecipesByUser);
router.post('/addRecipe', userAuth, addRecipe);
router.put('/updateRecipes/:id', userAuth, updateRecipes);
router.delete('/deleteRecipe/:id', userAuth, deleteRecipe);

export default router;
