import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUserService = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('El usuario o correo ya está registrado.');
  }

  // La contraseña se hashea automáticamente en el middleware pre-save del modelo User
  const newUser = new User({ username, email, password });
  await newUser.save();

  return { message: 'Usuario registrado exitosamente', userId: newUser._id };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Credenciales inválidas.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas.');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return { token, user: { id: user._id, username: user.username, email: user.email } };
};

export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('Usuario no encontrado.');
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    reputation: user.reputation, // Inicia en 100 por defecto en el modelo
    avatarUrl: user.avatarUrl,
    curseMarks: user.curseMarks, // Curse Log / marcas de maldición
    poltergeistUntil: user.politergeistUntil
  };
};