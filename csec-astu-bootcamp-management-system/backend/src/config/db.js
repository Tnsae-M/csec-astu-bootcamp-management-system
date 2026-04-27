import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function connectToDB(){
    try{
       const connect= await mongoose.connect(process.env.mongo_url);
       console.log('Connected to database successfully');
    }catch(err){
        console.log("Error occured while connecting to DB: ",err.message);
    }
}
export default connectToDB;