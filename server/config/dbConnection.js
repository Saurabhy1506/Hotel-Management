import mongoose from 'mongoose';

const connectToDB = async()=>{
try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to a database", mongoose.connection.host);

}catch(error){
    console.log("An error occured while connecting to a database", error);
    process.exit(1)
}
}
export {connectToDB}