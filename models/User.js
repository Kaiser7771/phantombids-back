import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  reputation: { type: Number, default: 100 },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e' },
  curseMarks: [{ type: String }],
  poltergeistUntil: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);