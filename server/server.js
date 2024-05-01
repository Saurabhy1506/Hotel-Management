import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectToDB } from './config/dbConnection.js';
import { router } from './routes/userRoutes.js';
import { bookingRouter } from './routes/bookingRoute.js';
import { roomRouter } from './routes/roomRoute.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(cookieParser());
const PORT = process.env.PORT || 8081;

//Database connection
connectToDB();

//route
app.use('/api/v1/users',router);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/room',roomRouter)

app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
})

