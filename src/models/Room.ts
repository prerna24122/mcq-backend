import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  code: string;
  questions: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>({
  name: { type: String, required: true, trim: true },
  code: { type: String, unique: true, uppercase: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

RoomSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  
  let existing = await mongoose.model('Room').findOne({ code });
  while (existing) {
    code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    existing = await mongoose.model('Room').findOne({ code });
  }
  this.code = code;
  next();
});

export default mongoose.model<IRoom>('Room', RoomSchema);