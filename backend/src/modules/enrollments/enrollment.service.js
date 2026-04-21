import Enrollment from "./enrollment.model.js";
import User from "../users/user.model.js";
import Bootcamp from "../bootcamps/bootcamp.model.js";
import mongoose from "mongoose";


const buildError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Enroll user


export const enrollUser = async (userId, bootcampId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw buildError("User not found", 404);

    const bootcamp = await Bootcamp.findById(bootcampId).session(session);
    if (!bootcamp) throw buildError("Bootcamp not found", 404);

    const existing = await Enrollment.findOne({ userId, bootcampId }).session(session);
    if (existing) throw buildError("Already enrolled", 409);

    const enrollment = await Enrollment.create(
      [{ userId, bootcampId }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return enrollment[0];

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
// export const enrollUser = async (userId, bootcampId) => {
//   const user = await User.findById(userId);
//   if (!user) throw buildError("User not found", 404);

//   if (user.role !== "student") {
//   throw buildError("Only students can be enrolled", 400);
// }

//   const bootcamp = await Bootcamp.findById(bootcampId);
//   if (!bootcamp) throw buildError("Bootcamp not found", 404);

//   const existing = await Enrollment.findOne({ userId, bootcampId });
//   if (existing) {
//     throw buildError("User already enrolled in this bootcamp", 409);
//   }

//   return await Enrollment.create({ userId, bootcampId });
// };

// Get students in a bootcamp
export const getBootcampEnrollments = async (bootcampId) => {
  return await Enrollment.find({ bootcampId })
    .populate("userId", "name email role status")
    .populate("bootcampId", "name");
};

//  Get current user's enrollments
export const getMyEnrollments = async (userId) => {
  return await Enrollment.find({ userId })
    .populate("bootcampId", "name startDate endDate status");
};

//  Update enrollment status
export const updateEnrollmentStatus = async (id, status) => {
  const enrollment = await Enrollment.findById(id);

  if (!enrollment) throw buildError("Enrollment not found", 404);

  enrollment.status = status;
  await enrollment.save();

  return enrollment;
};