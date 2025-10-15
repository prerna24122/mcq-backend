import express from 'express';
import { submitTest, getMyResult, getRoomResults, getAnalytics } from '../controllers/resultController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.post('/submit', authenticate, submitTest);
router.get('/my/:roomId', authenticate, getMyResult);
router.get('/room/:roomId', authenticate, authorizeRole('teacher'), getRoomResults);
router.get('/analytics/:roomId', authenticate, authorizeRole('teacher'), getAnalytics);

export default router;