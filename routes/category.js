import express from 'express';
import { createCategories, getCategories, getCategory, removeCategory, updateCategory } from '../controllers/category.js';
import { isAdmin, requireSignIn } from '../middlewares/auth.js';

const router = express.Router();

router.post('/category', requireSignIn, isAdmin, createCategories);
router.get('/categories', getCategories);
router.get('/category/:id', getCategory)
router.put('/category/:id', requireSignIn, isAdmin, updateCategory);
router.delete('/category/:id', requireSignIn, isAdmin, removeCategory)

export default router;