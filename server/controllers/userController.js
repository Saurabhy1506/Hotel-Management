import { userModel } from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async(req,res)=>{
   try{
    const {username, email, password, address, phone, role} = req.body;
    if(!username || !email || !password || !address || !phone || !role){
        return res.status(404).json({success:false, message:"Please enter all the required details"})
    }
   
    const checkExistingUser = await userModel.findOne({email:email})
    if(checkExistingUser){
        return res.status(500).json({success:false, message:"Email is already registed with us."})
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    const newUser =  new userModel({
        username:username,
        email:email,
        password:hashPassword,
        address:address,
        phone:phone,
        role:role
    })
    await newUser.save();
    res.status(201).json({success:true, message:`${username} is registered successfully`})

   }catch(error){
    console.log("An error occued while registering", error);
    res.status(500).json({success:false,message:"Internal server error", error:error})
   }
}
const loginUser = async(req,res)=>{
const {email, password} = req.body;
if(!email || !password){
    return res.status(400).json({success:false, message:"Please enter all the required details to login"})
}
const checkUser = await userModel.findOne({email:email})
// console.log(checkUser);
if(!checkUser){
    return res.status(500).json({success:false, message:"user not found"})
}
const isMatch = await bcrypt.compare(password, checkUser.password);
if(!isMatch){
    return res.status(400).json({success:false,message:"invalid credential"})
}
const token = jwt.sign({id:checkUser._id, Role:checkUser.role},process.env.PRIVATE_KEY,{expiresIn:'15d'});
console.log(token);
res.status(200).cookie('token',token,{
    expires:new Date(Date.now() + 15 * 24 * 60 * 60 *1000 ),
}).json({success:true, message:"Login Successfull"})
}
export {registerUser, loginUser}