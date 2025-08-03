import Assignment from '../../models/Assignment.js';
import CourseProgress from '../../models/courseProgress.js';

export const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate } = req.body;
    const newAssignment = new Assignment({
      courseId,
      title,
      description,
      dueDate,
    });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      req.body,
      { new: true }
    );
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    await Assignment.findByIdAndDelete(assignmentId);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ courseId }).populate('courseId');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId).populate(
      'submissions.studentId'
    );
    res.json(assignment.submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { grade } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    const submission = assignment.submissions.id(submissionId);
    submission.grade = grade;
    await assignment.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewSubmission = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { status, rejectionReason } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = status;
    if (status === 'rejected') {
      submission.rejectionReason = rejectionReason;
    } else {
      submission.rejectionReason = undefined; // Clear reason if not rejected
    }

    await assignment.save();

    // Check for course completion if the submission is approved
    if (status === 'approved') {
      const studentId = submission.studentId;
      const courseId = assignment.courseId;

      // Get all assignments for this course
      const allCourseAssignments = await Assignment.find({ courseId });

      let allAssignmentsApproved = true;
      for (const courseAssignment of allCourseAssignments) {
        const studentSubmissionForThisAssignment = courseAssignment.submissions.find(
          (sub) => sub.studentId.toString() === studentId.toString()
        );

        if (!studentSubmissionForThisAssignment || studentSubmissionForThisAssignment.status !== 'approved') {
          allAssignmentsApproved = false;
          break;
        }
      }

      if (allAssignmentsApproved) {
          // Generate a placeholder certificate URL (you can replace this with actual generation logic)
          const certificateUrl = `/certificates/${studentId}/${courseId}`; // Example URL

          // Update CourseProgress to completed and add certificate URL
          await CourseProgress.findOneAndUpdate(
            { userId: studentId, courseId: courseId },
            { completed: true, completionDate: new Date().toISOString(), certificateUrl: certificateUrl },
            { new: true }
          );
        }
    }

    res.json({ message: 'Submission reviewed successfully', submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubmittedAssignments = async (req, res) => {
  try {
    const assignmentsWithSubmissions = await Assignment.find({ 'submissions.0': { '$exists': true } }).populate('submissions.studentId').populate('courseId');
    res.json(assignmentsWithSubmissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


