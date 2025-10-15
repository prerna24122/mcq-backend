import { Request, Response } from 'express';
import Result from '../models/Result';
import Room from '../models/Room';

export const submitTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, answers } = req.body;
    const room = await Room.findById(roomId).populate('questions');
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const existing = await Result.findOne({ student: req.user?._id, room: roomId });
    if (existing) {
      res.status(400).json({ message: 'Already submitted' });
      return;
    }

    const processedAnswers = room.questions.map((q: any, i: number) => ({
      questionId: q._id,
      selectedAnswer: answers[i],
      isCorrect: answers[i] === q.correctAnswer,
    }));

    const score = processedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = room.questions.length;
    const percentage = (score / totalQuestions) * 100;

    await Result.create({
      student: req.user?._id,
      room: roomId,
      answers: processedAnswers,
      score,
      totalQuestions,
      percentage,
    });

    res.status(201).json({ message: 'Submitted', result: { score, totalQuestions, percentage } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Result.findOne({ student: req.user?._id, room: req.params.roomId }).populate('room');
    if (!result) {
      res.status(404).json({ message: 'No result found' });
      return;
    }
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const results = await Result.find({ room: req.params.roomId }).populate('student', 'name email');
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const results = await Result.find({ room: req.params.roomId });
    if (!results.length) {
      res.json({ message: 'No submissions' });
      return;
    }

    const scores = results.map((r) => r.score);
    const percentages = results.map((r) => r.percentage);

    res.json({
      analytics: {
        totalSubmissions: results.length,
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        averagePercentage: percentages.reduce((a, b) => a + b, 0) / percentages.length,
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        scoreDistribution: {
          '0-25': percentages.filter((p) => p <= 25).length,
          '26-50': percentages.filter((p) => p > 25 && p <= 50).length,
          '51-75': percentages.filter((p) => p > 50 && p <= 75).length,
          '76-100': percentages.filter((p) => p > 75).length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};