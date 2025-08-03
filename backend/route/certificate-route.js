import express from 'express';
import { generateCertificate } from '../controllers/certificate-controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:studentId/:courseId', auth, generateCertificate);

export default router;
