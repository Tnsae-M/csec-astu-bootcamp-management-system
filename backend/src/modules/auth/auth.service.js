import User from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser=async(email,password)=>{
    //find user
    const findUser=await User.findOne({email});
    if(!findUser){
        throw new Error("User not found");
    };
    //compare password
    const isMatch=await bcrypt.compare(password,findUser.password);
    if(!isMatch){
        throw new Error("password is incorrect. please try again.");
    };
    const token=jwt.sign({userId:findUser._id.toString(),role:findUser.role},process.env.JWT_SECRET,{expiresIn:"1d"});
    return {
        token,
        user:{
            id:findUser._id,
            name:findUser.name,
            email:findUser.email,
            role:findUser.role,
            status:findUser.status
        }
    };
}
//create user logic for admin to add new users
export const createUser=async(data)=>{
  const checkUser = await User.findOne({ email: data.email });
  if (checkUser) {
    throw new Error("User already exists");
  }
  const hashedPass = await bcrypt.hash(data.password, 10);
  const newUser = await User.create({
    ...data,
    password: hashedPass,
  });
  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
  };
};