import Assignment from '../../models/Assignment.js';
import CourseProgress from '../../models/courseProgress.js';

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!courseProgress || !courseProgress.completed) {
      return res.status(403).json({ message: 'You must complete the course to view assignments.' });
    }

    const assignments = await Assignment.find({ courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user._id;
    const file = req.file; // Multer stores the file info in req.file

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
    }

    const courseId = assignment.courseId;

    const courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!courseProgress || !courseProgress.completed) {
      return res.status(403).json({ message: 'You must complete the course to submit assignments.' });
    }

    assignment.submissions.push({ studentId: userId, fileUrl: file.path });
    await assignment.save();
    res.status(201).json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
