import { registerUserService, loginUserService, getUserProfileService } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const result = await registerUserService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await getUserProfileService(req.user.userId);
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
