import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/modules/users/user.model.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB.");

    const email = "sihamkassim735@gmail.com";
    const password = "AdminPassword123!";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let user = await User.findOne({ email });
    if (user) {
      user.role = "admin";
      user.password = hashedPassword;
      await user.save();
      console.log("Updated existing user to admin with email: " + email);
    } else {
      user = new User({
        name: "Siham Kassim",
        email: email,
        password: hashedPassword,
        role: "admin",
        status: "active",
        isEmailVerified: true
      });
      await user.save();
      console.log("Created new admin user with email: " + email);
    }
    console.log("Password for the account: " + password);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();
