import express from 'express';
import { createQuestion, getQuestions, deleteQuestion } from '../controllers/questionController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, authorizeRole('teacher'), createQuestion);
router.get('/', authenticate, authorizeRole('teacher'), getQuestions);
router.delete('/:id', authenticate, authorizeRole('teacher'), deleteQuestion);

export default router;