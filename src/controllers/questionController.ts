import { Request, Response } from 'express';
import Question from '../models/Question';

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionText, options, correctAnswer } = req.body;
    if (!questionText || !options || correctAnswer === undefined) {
      res.status(400).json({ message: 'All fields required' });
      return;
    }

    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      createdBy: req.user?._id,
    });

    res.status(201).json({ message: 'Question created', question });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await Question.find({ createdBy: req.user?._id });
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};