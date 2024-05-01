import express from 'express';
import { createBooking, deleteBooking, getAvailability, updateBooking } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const bookingRouter = express.Router();

bookingRouter.get('/availability', getAvailability);
bookingRouter.post('/createBooking',verifyToken,createBooking);
bookingRouter.put('/updateBooking/:_id',verifyToken,updateBooking);
bookingRouter.delete('/deleteBooking/:_id',verifyToken, deleteBooking);

export {bookingRouter}