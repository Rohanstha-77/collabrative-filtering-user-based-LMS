import express from 'express';
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByCourse,
  getAssignmentSubmissions,
  gradeSubmission,
  reviewSubmission,
  getAllSubmittedAssignments,
} from '../../controllers/admin-Controllers/assignment-controller.js';
import { auth, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', auth, isAdmin, createAssignment);
router.put('/:assignmentId', auth, isAdmin, updateAssignment);
router.delete('/:assignmentId', auth, isAdmin, deleteAssignment);
router.get('/course/:courseId', auth, isAdmin, getAssignmentsByCourse);
router.get('/:assignmentId/submissions', auth, isAdmin, getAssignmentSubmissions);
router.put('/:assignmentId/submissions/:submissionId', auth, isAdmin, gradeSubmission);
router.put('/:assignmentId/submissions/:submissionId/review', auth, isAdmin, reviewSubmission);
router.get('/submitted', auth, isAdmin, getAllSubmittedAssignments);

export default router;
