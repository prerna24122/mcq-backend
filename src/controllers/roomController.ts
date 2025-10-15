import { Request, Response } from 'express';
import Room from '../models/Room';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, questionIds } = req.body;
    if (!name || !questionIds?.length) {
      res.status(400).json({ message: 'Name and questions required' });
      return;
    }

    const room = await Room.create({ name, questions: questionIds, createdBy: req.user?._id });
    res.status(201).json({ message: 'Room created', room });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({ createdBy: req.user?._id }).populate('questions');
    res.json({ rooms });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const joinRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findOne({ code: req.body.code, isActive: true }).populate('questions');
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const questions = room.questions.map((q: any) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({ room: { _id: room._id, name: room.name, code: room.code, questions } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleRoomStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    room.isActive = !room.isActive;
    await room.save();
    res.json({ message: 'Status updated', room });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET room by ID (for students taking test)
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const room = await Room.findById(id).populate('questions');
    
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    // Don't send correct answers to students
    const questionsWithoutAnswers = room.questions.map((q: any) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({
      room: {
        _id: room._id,
        name: room.name,
        code: room.code,
        questions: questionsWithoutAnswers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
