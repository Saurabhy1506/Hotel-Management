import express from 'express';
import { createRoom, deleteRoom, updateRoom } from '../controllers/roomController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
const roomRouter = express.Router();

roomRouter.post('/',verifyAdmin, createRoom );
roomRouter.put('/:_id',verifyAdmin, updateRoom);
roomRouter.delete('/:_id',verifyAdmin, deleteRoom)

export {roomRouter}