import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "room", required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const bookingModel = mongoose.model("booking", bookingSchema);
export { bookingModel };
