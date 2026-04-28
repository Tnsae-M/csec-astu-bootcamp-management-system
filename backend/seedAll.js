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
      name: "Siham Kassim",
      email: "sihamkassim1@gmail.com",
      password: hashedPassword,
      role: "super admin",
    });

    const admin = await User.create({
      name: "Tinsae M.",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    const instructor = await User.create({
      name: "John Instructor",
      email: "instructor@example.com",
      password: hashedPassword,
      role: "instructor",
    });

    const student1 = await User.create({
      name: "Alice",
      email: "student1@example.com",
      password: hashedPassword,
      role: "student",
    });

    const student2 = await User.create({
      name: "Abel",
      email: "student2@example.com",
      password: hashedPassword,
      role: "student",
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
      createdBy: admin._id,
      instructors: [instructor._id],
      status: "active",
    });

    // 4. Enrollments
    console.log("Seeding Enrollments...");
    await Enrollment.create([
      { userId: student1._id, bootcampId: webBootcamp._id, status: "active" },
      { userId: student2._id, bootcampId: webBootcamp._id, status: "active" },
    ]);

    // 5. Groups
    console.log("Seeding Groups...");
    const groupAlpha = await Group.create({
      name: "Team Alpha",
      bootcampId: webBootcamp._id,
      members: [student1._id, student2._id],
      createdBy: instructor._id,
    });

    // 6. Sessions
    console.log("Seeding Sessions...");
    const session1 = await Session.create({
      title: "Mastering React Hooks & State",
      description: "Deep dive into useState, useEffect, and custom hooks.",
      bootcamp: webBootcamp._id,
      instructor: instructor._id,
      location: "Main Lab - ASTU",
      startTime: new Date("2026-05-02T09:00:00"),
      endTime: new Date("2026-05-02T12:00:00"),
      status: "completed",
    });

    const session2 = await Session.create({
      title: "Backend Integration with Express",
      description: "Building robust APIs and connecting them to React.",
      bootcamp: webBootcamp._id,
      instructor: instructor._id,
      location: "Main Lab - ASTU",
      startTime: new Date("2026-05-05T09:00:00"),
      endTime: new Date("2026-05-05T12:00:00"),
      status: "scheduled",
    });

    // 7. Attendance
    console.log("Seeding Attendance...");
    await Attendance.create([
      { userId: student1._id, sessionId: session1._id, bootcampId: webBootcamp._id, status: "present", markedBy: instructor._id },
      { userId: student2._id, sessionId: session1._id, bootcampId: webBootcamp._id, status: "absent", markedBy: instructor._id },
    ]);

    // 8. Tasks
    console.log("Seeding Tasks...");
    const task1 = await Task.create({
      title: "Portfolio Website Project",
      description: "Build a responsive portfolio using React and Tailwind CSS.",
      bootcampId: webBootcamp._id,
      sessionId: session1._id,
      createdBy: instructor._id,
      dueDate: new Date("2026-05-10"),
    });

    // 9. Submissions
    console.log("Seeding Submissions...");
    await Submission.create({
      taskId: task1._id,
      studentId: student1._id,
      content: "Deployment link: csec-alice-portfolio.vercel.app",
      status: "submitted",
    });

    // 10. Feedback
    console.log("Seeding Feedback...");
    await Feedback.create({
      studentId: student1._id,
      sessionId: session1._id,
      bootcampId: webBootcamp._id,
      instructorId: instructor._id,
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
