import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import connectDB from "./src/config/db.js";

// Models
import User from "./src/modules/users/user.model.js";
import Division from "./src/modules/divisions/division.model.js";
import Bootcamp from "./src/modules/bootcamps/bootcamp.model.js";
import Enrollment from "./src/modules/enrollments/enrollment.model.js";
import Group from "./src/modules/groups/group.model.js";
import Session from "./src/modules/sessions/session.model.js";
import Attendance from "./src/modules/attendance/attendance.model.js";
import Task from "./src/modules/tasks/task.model.js";
import Submission from "./src/modules/submissions/submission.model.js";
import Feedback from "./src/modules/feedback/feedback.model.js";

const seed = async () => {
  try {
    await connectDB();

    console.log("Cleaning database for a fresh seed...");
    await User.deleteMany({});
    await Division.deleteMany({});
    await Bootcamp.deleteMany({});
    await Enrollment.deleteMany({});
    await Group.deleteMany({});
    await Session.deleteMany({});
    await Attendance.deleteMany({});
    await Task.deleteMany({});
    await Submission.deleteMany({});
    await Feedback.deleteMany({});

    // Drop indexes to clear "ghost" unique constraints that might cause E11000 errors
    const collectionsToClear = [
      User, Enrollment, Feedback, Bootcamp, Division, 
      Attendance, Session, Task, Submission, Group
    ];
    for (const model of collectionsToClear) {
      try {
        await model.collection.dropIndexes();
        console.log(`Cleared indexes for: ${model.modelName}`);
      } catch (e) {
        // console.log(`No indexes to clear for ${model.modelName}`);
      }
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Users
    console.log("Seeding Users...");
    const superAdmin = await User.create({
      name: "Tinsae Melkamu",
      email: "tinsaemk6679@gmail.com",
      password: hashedPassword,
      roles: ["SUPER ADMIN"],
    });

    const adminInstructor = await User.create({
      name: "Tinsae Melkamu",
      email: "tinsae.melkamu.tk@gmail.com",
      password: hashedPassword,
      roles: ["ADMIN", "INSTRUCTOR"],
    });

    const student = await User.create({
      name: "Tinsae Student",
      email: "tnsaemelkamu372@gmail.com",
      password: hashedPassword,
      roles: ["STUDENT"],
    });

    // 2. Divisions
    console.log("Seeding 'Development' Division...");
    const devDiv = await Division.create({
      name: "Development Division",
      description: "Core development division for CSEC-ASTU bootcamps.",
      createdBy: superAdmin._id,
    });

    // 3. Bootcamps
    console.log("Seeding Bootcamps...");
    const webBootcamp = await Bootcamp.create({
      name: "CSEC Web Development Bootcamp",
      divisionId: devDiv._id,
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-08-01"),
      createdBy: adminInstructor._id,
      instructors: [adminInstructor._id],
      status: "active",
    });

    // 4. Enrollments
    console.log("Seeding Enrollments...");
    await Enrollment.create([
      { userId: student._id, bootcampId: webBootcamp._id, status: "active" },
    ]);

    // 5. Groups
    console.log("Seeding Groups...");
    const groupAlpha = await Group.create({
      name: "Team Alpha",
      bootcampId: webBootcamp._id,
      members: [student._id],
      createdBy: adminInstructor._id,
    });

    // 6. Sessions
    console.log("Seeding Sessions...");
    const session1 = await Session.create({
      title: "Mastering React Hooks & State",
      description: "Deep dive into useState, useEffect, and custom hooks.",
      bootcamp: webBootcamp._id,
      instructor: adminInstructor._id,
      location: "Main Lab - ASTU",
      startTime: new Date("2026-05-02T09:00:00"),
      endTime: new Date("2026-05-02T12:00:00"),
      status: "completed",
    });

    const session2 = await Session.create({
      title: "Backend Integration with Express",
      description: "Building robust APIs and connecting them to React.",
      bootcamp: webBootcamp._id,
      instructor: adminInstructor._id,
      location: "Main Lab - ASTU",
      startTime: new Date("2026-05-05T09:00:00"),
      endTime: new Date("2026-05-05T12:00:00"),
      status: "scheduled",
    });

    // 7. Attendance
    console.log("Seeding Attendance...");
    await Attendance.create([
      { userId: student._id, sessionId: session1._id, bootcampId: webBootcamp._id, status: "present", markedBy: adminInstructor._id },
    ]);

    // 8. Tasks
    console.log("Seeding Tasks...");
    const task1 = await Task.create({
      title: "Portfolio Website Project",
      description: "Build a responsive portfolio using React and Tailwind CSS.",
      bootcampId: webBootcamp._id,
      sessionId: session1._id,
      createdBy: adminInstructor._id,
      dueDate: new Date("2026-05-10"),
    });

    // 9. Submissions
    console.log("Seeding Submissions...");
    await Submission.create({
      taskId: task1._id,
      studentId: student._id,
      content: "Deployment link: csec-tinsae-portfolio.vercel.app",
      status: "submitted",
    });

    // 10. Feedback
    console.log("Seeding Feedback...");
    await Feedback.create({
      studentId: student._id,
      sessionId: session1._id,
      bootcampId: webBootcamp._id,
      instructorId: adminInstructor._id,
      rating: 5,
      comment: "Excellent session! The live coding part was very helpful.",
      isAnonymous: false,
    });

    console.log("Database seeded successfully with clean state!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
