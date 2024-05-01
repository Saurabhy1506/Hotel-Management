import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true
    },
    address:{
        type:String,
        required:[true,"address is required"],
    },
    phone:{
        type:String,
        required:[true,"phone is required"],
        trim:true
    },
    role:{
        type:String,
        enum:['admin','regular'],
        required:[true,"role is required"],
        default:'regular'
    },
    // bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'booking' }],

},   { timestamps: true }
)

const userModel = mongoose.model('user',userSchema);
export {userModel}