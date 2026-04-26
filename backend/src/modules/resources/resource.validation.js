// import mongoose from "mongoose";

// export const validateCreateResource = (req, res, next) => {
//   const { title, type, url, session } = req.body;

//   if (!title || !type || !url || !session) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields are required",
//     });
//   }

//   if (!mongoose.Types.ObjectId.isValid(session)) {
//     return res.status(422).json({
//       success: false,
//       message: "Invalid session ID",
//     });
//   }

//   next();
// };