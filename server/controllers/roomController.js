import mongoose from "mongoose";
import { roomModel } from "../models/roomModel.js";


const createRoom = async (req, res) => {
  try {
    const { roomType, price, capacity, description } = req.body;
    if (!roomType || !price || !capacity || !description) {
      return res
        .status(404)
        .json({ success: false, message: "please fill all the required data" });
    }
    const room = new roomModel({
      roomType: roomType,
      price: price,
      capacity: capacity,
      description: description,
    });
    await room.save();
    res.status(201).json({ message: "Room created successfully" });
  } catch (error) {
    res.status(500).json({success:false, message: "an error occured while creating room" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const {_id} = req.params;
    const { roomType, price, capacity, description} = req.body;
    let existingRoom;
    try {
      existingRoom = await roomModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        return res.status(404).json({ success: false, message: "Invalid id" });
      }
      throw error;
    }  
    if (!existingRoom) {
      return res.status(404).json({success:false, message: "Invalid id" });
    }
    const room = await roomModel.findByIdAndUpdate(
      _id,
      { roomType, price, capacity, description },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await room.save();
    res.json({success:true, message: "Room updated successfully" });
  } catch (error) {
    console.log(error,"An error occured while updating room");
    res.status(400).json({success:false, message: "An error occured while updating room" , error:error});
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { _id } = req.params;
    let existingRoom;
    try {
      existingRoom = await roomModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        return res.status(404).json({ success: false, message: "Invalid id" });
      }
      throw error;
    }  
    const room =  await roomModel.findByIdAndDelete(_id);
if(room === null){
  return res.status(404).json({sucess:true,message:"seems like this room is already deleted"})
}   
 res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log("an error occued while deleting room", error);
    res.status(400).json({success:false, message: "an error occued while deleting room" });
  }
};
export { createRoom, updateRoom, deleteRoom };
