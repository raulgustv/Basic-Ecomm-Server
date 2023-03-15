import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import * as dotenv from 'dotenv';
import { db } from './database/db.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/orders.js';



dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

//database
db();

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);


app.listen(8000, () =>{
    console.log(`Server running on port ${port}`)
});