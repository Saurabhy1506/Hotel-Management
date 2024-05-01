import mongoose from "mongoose";
import { bookingModel } from "../models/bookingModel.js";
import { roomModel } from "../models/roomModel.js";
import { userModel } from "../models/userModel.js";

const getAvailability = async (req, res) => {
  const { checkin, checkout, roomType } = req.query;

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);

  if (isNaN(checkinDate) || isNaN(checkoutDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    const roomData = await roomModel.find({ roomType:roomType });
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }
    const roomIds = roomData.map(room => room._id);
    // console.log(roomIds);

    const bookings = await bookingModel.find({
      room: { $in: roomIds },
      $or: [
        { checkin: { $gte: checkinDate, $lt: checkoutDate } },
        { checkout: { $gt: checkinDate, $lte: checkoutDate } },
      ],
    });
    const bookedRooms = bookings.map((booking) => booking.room);
    const availableRooms = roomData.filter(room => !bookedRooms.includes(room._id));

    res.json({ availableRooms });
  } catch (error) {
    console.log(error, "an error occured");
    res.status(500).json({ message: "Internal server error" , error:error});
  }
};

const createBooking = async (req, res) => {
  try {
    const { checkin, checkout, roomType } = req.query;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const roomData = await roomModel.findOne({roomType:roomType });
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }
    const booking = new bookingModel({
      user:userId,
      room: roomData._id,
      checkin,
      checkout,
    });
    await booking.save();
    res.status(201).json({succes:true, message: "Booking created successfully" });
  } catch (error) {
    res.status(400).json({success:false, message: "Invalid request" ,error:error});
  }
};

const updateBooking = async (req, res) => {
  const { _id } = req.params;
  const { roomType, checkin, checkout } = req.body;
  
  const userId = req.userId;
  
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const room = await roomModel.findOne({ roomType });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    let existingRoom;
    try {
      existingRoom = await roomModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        return res.status(404).json({ success: false, message: "Invalid id" });
      }
      throw error;
    } 
    const booking = await bookingModel.findOneAndUpdate(
      { _id: _id },
      { room: room._id, checkin, checkout  },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({sucess:false, message: "Booking not found" });
    }
    await booking.save();
    res.json({success:true, message: "Booking updated successfully" });
  } catch (error) {
    res.status(400).json({success:true, message: "Invalid request" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { _id } = req.params;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({succes:false, message: "User not found" });
    }
    // Check if the provided _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await bookingModel.findOneAndDelete({ _id: _id });
    console.log(booking);
    if (!booking) {
      return res.status(404).json({succes:false, message: "Booking not found or already cancelled" });
    }
    res.json({succes:true, message: "Booking canceled successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({succes:false, message: "Invalid request" });
  }
};

export { getAvailability, createBooking, updateBooking, deleteBooking };
