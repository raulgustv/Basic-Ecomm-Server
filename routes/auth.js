import express from 'express';
import { adminCheck, authCheck, login, profileUpdate, register, secret } from '../controllers/auth.js';
import { isAdmin, requireSignIn } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register );
router.post('/login', login);
router.get('/auth-check', requireSignIn, authCheck)
router.get('/admin-check', requireSignIn, isAdmin, adminCheck)

//testing
router.get('/secret', requireSignIn, isAdmin, secret);

//profile
router.put('/profile', requireSignIn, profileUpdate )

export default router;