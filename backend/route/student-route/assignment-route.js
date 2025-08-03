import express from 'express';
import multer from 'multer';
import {
  getAssignmentsByCourse,
  submitAssignment,
} from '../../controllers/student-controllers/assignment-controller.js';
import { auth } from '../../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get('/course/:courseId', auth, getAssignmentsByCourse);
router.post('/:assignmentId/submit', auth, upload.single('file'), submitAssignment);

export default router;
