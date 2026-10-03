import Bet from '../models/Bet.js';
import Auction from '../models/Auction.js';
import User from '../models/User.js';

export const placeBetService = async (userId, { auctionId, targetAlias, amount }) => {
  if (![5, 10, 25, 50].includes(amount)) {
    throw new Error('El monto de la apuesta debe ser 5, 10, 25 o 50 puntos.');
  }

  const auction = await Auction.findById(auctionId);
  if (!auction) throw new Error('Subasta no encontrada.');

  if (auction.status !== 'open') {
    throw new Error('La subasta ya está cerrada o cancelada.');
  }

  // Validar que la apuesta se realice al menos 1 hora antes del cierre (endDate)
  const oneHourBeforeEnd = new Date(auction.endDate.getTime() - 60 * 60 * 1000);
  if (new Date() > oneHourBeforeEnd) {
    throw new Error('Ya no se pueden realizar apuestas; quedan menos de 2 horas/1 hora para el cierre.');
  }

  // Validar reputación del usuario
  const user = await User.findById(userId);
  if (user.reputation < amount) {
    throw new Error('No tienes suficiente reputación para esta apuesta.');
  }

  const newBet = new Bet({
    auction: auctionId,
    user: userId,
    targetAlias,
    amount,
    status: 'pending'
  });

  await newBet.save();
  return newBet;
};

export const getUserBetsService = async (userId) => {
  return await Bet.find({ user: userId }).populate('auction');
};

// Servicio auxiliar de resolución (multiplica x3 o descuenta)
export const resolveBetsService = async (auctionId, winningAlias) => {
  const bets = await Bet.find({ auction: auctionId, status: 'pending' });

  for (const bet of bets) {
    const user = await User.findById(bet.user);
    if (bet.targetAlias === winningAlias) {
      bet.status = 'won';
      user.reputation += bet.amount * 3; // Multiplica por 3 los puntos
    } else {
      bet.status = 'lost';
      user.reputation -= bet.amount; // Descuenta la apuesta
    }
    await user.save();
    await bet.save();
  }
};