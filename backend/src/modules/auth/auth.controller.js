import { createUser,loginUser } from "./auth.service.js";

export const login=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const result=await loginUser(email,password);
       return res.status(200).json({
            message:"Login successful",
            data:result
        });
    }catch(err){
        return next(err);
    }
};
//admin controller
export const register=async(req,res,next)=>{
    try{
        const data=req.body;
        const result=await createUser(data);
         return res.status(201).json({
            message:"User created successfully",
            data:result
        });
    }catch(err){
        return next(err);
    }
}