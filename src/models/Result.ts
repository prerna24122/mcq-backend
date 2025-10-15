import mongoose, { Document, Schema } from 'mongoose';

interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: Date;
}

const AnswerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: { type: Number, required: true, min: 0, max: 3 },
  isCorrect: { type: Boolean, required: true },
});

const ResultSchema = new Schema<IResult>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  answers: [AnswerSchema],
  score: { type: Number, required: true, min: 0 },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

ResultSchema.index({ student: 1, room: 1 }, { unique: true });

export default mongoose.model<IResult>('Result', ResultSchema);