import Enrollment from './enrollment.model.js';
import User from '../users/user.model.js';
import Division from '../divisions/division.model.js';

export const enrollStudent = async (studentId, divisionId) => {
  // 1. Verify the User is actually a Student
  const student = await User.findById(studentId);
  if (!student || student.role !== 'Student') {
    const error = new Error('Only users with the Student role can be enrolled in divisions');
    error.statusCode = 400;
    throw error;
  }

  // 2. Verify Division exists
  const division = await Division.findById(divisionId);
  if (!division) {
    const error = new Error('Division not found');
    error.statusCode = 404;
    throw error;
  }

  // 3. Check for existing enrollment (Maybe they dropped and want to come back)
  const existingEnrollment = await Enrollment.findOne({ student: studentId, division: divisionId });
  
  if (existingEnrollment) {
    if (existingEnrollment.status === 'Active') {
      const error = new Error('This student is already actively enrolled in this division');
      error.statusCode = 409;
      throw error;
    } else {
      // Re-enroll them!
      existingEnrollment.status = 'Active';
      return await existingEnrollment.save();
    }
  }

  // Create brand new enrollment
  const enrollment = new Enrollment({
    student: studentId,
    division: divisionId
  });

  return await enrollment.save();
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId, 
    { status }, 
    { new: true, runValidators: true }
  );

  if (!enrollment) {
    const error = new Error('Enrollment record not found');
    error.statusCode = 404;
    throw error;
  }
  return enrollment;
};

// Extremely useful for Instructors viewing their roster
export const getDivisionStudents = async (divisionId) => {
  return await Enrollment.find({ division: divisionId, status: 'Active' })
    .populate('student', 'name email status');
};

// Helpful for a student's dashboard profile
export const getStudentEnrollments = async (studentId) => {
  return await Enrollment.find({ student: studentId })
    .populate('division', 'name description');
};

export const getAllEnrollments = async () => {
  return await Enrollment.find()
    .populate('student', 'name email role')
    .populate('division', 'name');
};
