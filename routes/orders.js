import express from 'express';
import { adminUpdateStatus, getAllOrdersAdmin, getOrderByUser, userCancellOrder } from '../controllers/order.js';
import { isAdmin, requireSignIn } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user-orders', requireSignIn, getOrderByUser);
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersAdmin);
router.put('/cancel-order/:id', requireSignIn, userCancellOrder);
router.put('/update-order/:id', requireSignIn, isAdmin, adminUpdateStatus);




export default router;