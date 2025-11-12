// node-server/routes/categories.route.js
import express from 'express';
import {
  getAllCategories,
  getAllCategoriesAndRecipe,
  getCategoryByIdWithRec
} from '../controllers/categories.controller.js';

const router = express.Router();

router.get('/getallcategories', getAllCategories);
router.get('/getAllCategoriesAndRecipe', getAllCategoriesAndRecipe);
router.get('/getCategoryByIdWithRec/:id', getCategoryByIdWithRec);

export default router;
//מה שיש שם: הנתיבים של האתר (כתובות URL).