import express from 'express';
import { createRoom, getRooms, joinRoom, toggleRoomStatus, getRoomById } from '../controllers/roomController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, authorizeRole('teacher'), createRoom);
router.get('/', authenticate, authorizeRole('teacher'), getRooms);
router.get('/:id', authenticate, getRoomById); // ADD THIS LINE
router.post('/join', authenticate, joinRoom);
router.patch('/:id/toggle', authenticate, authorizeRole('teacher'), toggleRoomStatus);

export default router;







