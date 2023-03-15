import express from 'express';
import formidable from 'express-formidable';
import { createProduct, filteredProducts, getPhoto, getProduct, getProducts, getToken, processPayment, productList, productsCount, relatedProducts, removeProduct, searchProduct, updateProduct } from '../controllers/product.js';
import { isAdmin, requireSignIn } from '../middlewares/auth.js';

const router = express.Router();


router.post('/product', requireSignIn, isAdmin, formidable(), createProduct);
router.get('/product', getProducts)
router.get('/product/:slug', getProduct)
router.get('/product/photo/:productId', getPhoto)
router.put('/product/:slug', requireSignIn, isAdmin, formidable(), updateProduct)
router.delete('/product/:slug', requireSignIn, isAdmin, removeProduct)

//filtering
router.post('/filtered-products', filteredProducts);
router.get('/products-count', productsCount);
router.get('/list-products/:page', productList);

//search
router.get('/products/search/:keyword', searchProduct );

//related products
router.get('/related-products/:productId/:categoryId', relatedProducts);

//BRAINTREE PAYMENTS
router.get('/braintree/token', getToken);
router.post('/braintree/payment', requireSignIn, processPayment)



export default router;