import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: String , default:"https://2.imimg.com/data2/SI/TS/MY-3125576/lemon_tree_hotel_single-room-500x500.jpg"},
  // bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'booking' }],
});

const roomModel = mongoose.model('room', roomSchema);
export {roomModel}