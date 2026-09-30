import Auction from '../models/Auction.js';
import User from '../models/User.js';
import HauntHouse from '../models/HauntHouse.js';
import crypto from 'crypto';

// Generador determinista de alias anónimo [Adjetivo]_[Número]
export const generateAnonymousAlias = (userId, auctionId) => {
  const adjectives = ['Spooky', 'Ghostly', 'Shadowy', 'Cursed', 'Phantom', 'Sinister', 'Spectral'];
  const hash = crypto.createHash('md5').update(`${userId}-${auctionId}`).digest('hex');
  const index = parseInt(hash.substring(0, 8), 16) % adjectives.length;
  const number = parseInt(hash.substring(8, 12), 16) % 9000 + 1000;
  return `${adjectives[index]}_${number}`;
};

// Crear Puja Secreta
export const placeBidService = async (auctionId, userId, amount) => {
  const auction = await Auction.findById(auctionId).populate('cursedObject');
  if (!auction || auction.status !== 'open') {
    const err = new Error('Subasta no disponible o cerrada.');
    err.statusCode = 400;
    throw err;
  }

  if (new Date() > new Date(auction.endDate)) {
    const err = new Error('El tiempo de esta subasta ha expirado.');
    err.statusCode = 400;
    throw err;
  }

  // Validar límites del objeto
  const { minBid, maxBid } = auction.cursedObject;
  if (amount < minBid || amount > maxBid) {
    const err = new Error(`La puja debe estar entre ${minBid} y ${maxBid}.`);
    err.statusCode = 400;
    throw err;
  }

  // Comprobar que el usuario solo puje 1 sola vez por subasta
  const alreadyBid = auction.bids.some(b => b.user.toString() === userId.toString());
  if (alreadyBid) {
    const err = new Error('Solo puedes realizar una oferta única por subasta.');
    err.statusCode = 400;
    throw err;
  }

  const alias = generateAnonymousAlias(userId, auctionId);
  auction.bids.push({ user: userId, alias, amount });
  await auction.save();

  return { message: 'Puja secreta registrada exitosamente.', alias };
};

// Cierre de Subasta: Cálculo Mínimo Único O(n log n) + Penalización por Duplicados
export const closeAuctionService = async (auctionId) => {
  const auction = await Auction.findById(auctionId);
  if (!auction || auction.status !== 'open') {
    const err = new Error('La subasta no existe o ya fue procesada.');
    err.statusCode = 400;
    throw err;
  }

  const bids = auction.bids;
  if (bids.length === 0) {
    auction.status = 'cancelled';
    await auction.save();
    return { message: 'Subasta cancelada sin ofertas.' };
  }

  // Conteo de frecuencias para detectar duplicados
  const frequencyMap = {};
  bids.forEach(b => {
    frequencyMap[b.amount] = (frequencyMap[b.amount] || 0) + 1;
  });

  // Identificar montos duplicados y aplicar penalización
  const duplicateAmounts = Object.keys(frequencyMap).filter(m => frequencyMap[m] > 1).map(Number);
  
  for (const bid of bids) {
    if (duplicateAmounts.includes(bid.amount)) {
      bid.isDuplicate = true;
      // Penalizar usuario: -5 reputación y Poltergeist 48 hrs
      const user = await User.findById(bid.user);
      if (user) {
        user.reputation = Math.max(0, user.reputation - 5);
        user.poltergeistUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
        await user.save();
      }

      // Actualizar rol en la Casa de Subasta a Poltergeist
      await HauntHouse.updateOne(
        { _id: auction.hauntHouse, 'members.user': bid.user },
        { $set: { 'members.$.role': 'Poltergeist' } }
      );
    }
  }

  // Algoritmo de Ganador Mínimo Único: Ordenar O(n log n) y Escanear
  const sortedBids = [...bids].sort((a, b) => a.amount - b.amount);
  let winningBidObj = null;

  for (const b of sortedBids) {
    if (frequencyMap[b.amount] === 1) {
      winningBidObj = b;
      break;
    }
  }

  if (winningBidObj) {
    auction.winner = winningBidObj.user;
    auction.winningBid = winningBidObj.amount;
    auction.status = 'closed';
  } else {
    // Si NO hay ofertas únicas, se cancela la subasta
    auction.status = 'cancelled';
  }

  await auction.save();
  return { 
    status: auction.status, 
    winner: auction.winner, 
    winningBid: auction.winningBid 
  };
};