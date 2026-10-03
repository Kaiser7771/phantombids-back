import * as betService from '../services/betService.js';

export const placeBet = async (req, res) => {
  try {
    const bet = await betService.placeBetService(req.user.userId, req.body);
    return res.status(201).json(bet);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserBets = async (req, res) => {
  try {
    const bets = await betService.getUserBetsService(req.user.userId);
    return res.status(200).json(bets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
