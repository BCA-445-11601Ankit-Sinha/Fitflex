import { errorHandler } from "./src/middleware/errorHandler";
import { NextFunction, type Request, type Response } from 'express';
import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/user.routes';
import productRoutes from './src/routes/product.routes';
import exerciseRoutes from './src/routes/exercise.route';
import cartRoutes from './src/routes/cart.routes';
import orderRoutes from './src/routes/order.routes';
import connectDB from "./src/config/connectDB";
const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

const PORT = Number(process.env.PORT);

connectDB();
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    console.log('request data', req.query);
    next();
})

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to FitFlex API');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});









app.use(errorHandler);