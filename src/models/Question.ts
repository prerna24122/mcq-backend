import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  questionText: string;
  options: string[];
  correctAnswer: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true, trim: true },
  options: {
    type: [String],
    required: true,
    validate: { validator: (v: string[]) => v.length === 4, message: 'Must have 4 options' },
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);