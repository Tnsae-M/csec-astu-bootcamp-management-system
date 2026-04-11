import Submission from './submission.model.js';
import Task from '../tasks/task.model.js';
import Enrollment from '../enrollments/enrollment.model.js';

export const submitWork = async (submissionData) => {
  const { task: taskId, student, fileUrl, githubUrl } = submissionData;

  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // NEW: Verify the student is actually enrolled in this task's division
  const enrollment = await Enrollment.findOne({ 
    student: student, 
    division: task.division,
    status: 'Active'
  });

  if (!enrollment) {
    const error = new Error('You must be actively enrolled in this division to submit work');
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // Business Rule 1: No submission after deadline
  if (new Date() > new Date(task.deadline)) {
    const error = new Error('The deadline for this task has passed. Late submissions are not allowed.');
    error.statusCode = 422; // Business Rule violation
    throw error;
  }

  // Business Rule 2: Enforce the required submission type
  if (task.submissionType === 'File' && !fileUrl) {
    const error = new Error('This task strictly requires a file upload submission.');
    error.statusCode = 400;
    throw error;
  }
  if (task.submissionType === 'GitHub link' && !githubUrl) {
    const error = new Error('This task strictly requires a GitHub repository link.');
    error.statusCode = 400;
    throw error;
  }
  if (task.submissionType === 'Both' && (!fileUrl || !githubUrl)) {
    const error = new Error('This task requires BOTH a file upload and a GitHub link.');
    error.statusCode = 400;
    throw error;
  }

  // Business Rule 3: Version Tracking for Resubmissions
  const existingSubmission = await Submission.findOne({ task: taskId, student: student });
  
  if (existingSubmission) {
    existingSubmission.fileUrl = fileUrl || existingSubmission.fileUrl;
    existingSubmission.githubUrl = githubUrl || existingSubmission.githubUrl;
    existingSubmission.version += 1; // Increment the version!
    existingSubmission.status = 'Pending'; // Send it back to the instructor's grading queue
    
    return await existingSubmission.save();
  }

  // If no existing submission exists, create a brand new one
  const newSubmission = new Submission(submissionData);
  return await newSubmission.save();
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const { score, feedback, status } = gradeData;
  
  const submission = await Submission.findById(submissionId).populate('task');
  if (!submission) {
    const error = new Error('Submission not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate that instructor isn't giving more points than allowed
  if (score !== undefined && score > submission.task.maxScore) {
    const error = new Error(`Score cannot exceed the maximum task score of ${submission.task.maxScore}`);
    error.statusCode = 400;
    throw error;
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.status = status || 'Graded'; // Status can be 'Graded' or 'Returned'
  
  const updatedSubmission = await submission.save();

  // Notice SRS Rule: "Submission graded -> Student notified"
  // TODO: Trigger the Notification System here to email/alert the student!

  return updatedSubmission;
};

// For instructors to view all submissions for an assignment
export const getSubmissionsForTask = async (taskId) => {
  return await Submission.find({ task: taskId })
    .populate('student', 'name email');
};

// For students to view their own grades/submissions
export const getStudentSubmissions = async (studentId) => {
  return await Submission.find({ student: studentId })
    .populate('task', 'title deadline maxScore');
};

export const getAllSubmissions = async () => {
  return await Submission.find()
    .populate('student', 'name email')
    .populate('task', 'title deadline');
};
