// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const uri = process.env.mongo_url;

//     if (!uri) {
//       throw new Error("MONGO_URL is not defined in .env");
//     }

//     await mongoose.connect(uri);
//     console.log(" MongoDB Connected");
//   } catch (error) {
//     console.error("DB Connection Error:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

const connectDB=async ()=>{

    try {
        if (!process.env.MONGODB_URI){
            throw new Error("MONGODB_URI is not defined");
}

         await mongoose.connect(process.env.MONGODB_URI,{
            maxPoolSize:10,
            serverSelectionTimeOutMS:5000,
            socketTimeoutMS:45000

         });
        }
        
     catch (error) {
        console.error("[Error] : DB Connection is Failed: ", error.message);
        process.exit(1);
        
    }

    
}

    mongoose.connection.on("connected",()=>{
        console.log("DB Connected Successfully");
    })

    mongoose.connection.on("error",(err)=>{
        console.error("[Error : ] MongoDB Run Time Error:",err.message);
    })

    mongoose.connection.on("disconnected",()=>{
        console.log("[Warn] : Mongodb disconnected");
    })

    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("DB Connection Closed via App Termination");
        process.exit(0);
        });

export default connectDB;