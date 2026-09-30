import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  reputation: { type: Number, default: 100 },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e' },
  curseMarks: [{ type: String }],
  poltergeistUntil: { type: Date, default: null }
}, { timestamps: true });

// Middleware pre-save: Hashea la contraseña automáticamente antes de guardar en la BD
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método helper para verificar la contraseña en el login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);