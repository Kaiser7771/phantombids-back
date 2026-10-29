import HauntHouse from '../models/HauntHouse.js';
import Bet from '../models/Bet.js';
import Auction from '../models/Auction.js';
import User from '../models/User.js';

export const getHouseRankingsService = async (houseId) => {
  const house = await HauntHouse.findById(houseId).populate('members.user');
  if (!house) throw new Error('Casa Embrujada no encontrada.');

  const memberIds = house.members.map(m => m.user._id);

  // 1. Worst Bidder: Usuario con menor reputación (o más penalizado) de la casa
  const worstBidder = await User.find({ _id: { $in: memberIds } })
    .sort({ reputation: 1 })
    .limit(1);

  // 2. Total Cursed: Usuario con más marcas de maldición (curseMarks)
  const usersInHouse = await User.find({ _id: { $in: memberIds } });
  let mostCursed = usersInHouse.reduce((prev, curr) => 
    (curr.curseMarks.length > prev.curseMarks.length) ? curr : prev, usersInHouse[0]
  );

  // 3. Free Spirit: Usuario que nunca ha ganado una subasta en esta casa
  const auctionsInHouse = await Auction.find({ hauntHouse: houseId });
  const auctionIds = auctionsInHouse.map(a => a._id);
  
  const winners = auctionsInHouse.map(a => a.winner?.toString()).filter(Boolean);
  const freeSpiritCandidates = house.members.filter(m => !winners.includes(m.user._id.toString()));

  // 4. Betting Prophet: Usuario con mayor tasa de aciertos en apuestas dentro de esta casa
  const bets = await Bet.find({ auction: { $in: auctionIds } });
  const userStats = {};

  bets.forEach(b => {
    if (!userStats[b.user]) userStats[b.user] = { total: 0, won: 0 };
    userStats[b.user].total += 1;
    if (b.status === 'won') userStats[b.user].won += 1;
  });

  let topProphet = null;
  let maxRate = -1;
  Object.keys(userStats).forEach(userId => {
    const stats = userStats[userId];
    const rate = stats.total > 0 ? stats.won / stats.total : 0;
    if (rate > maxRate) {
      maxRate = rate;
      topProphet = userId;
    }
  });

  const bettingProphetUser = topProphet ? await User.findById(topProphet) : null;

  return {
    worstBidder: worstBidder[0] || null,
    totalCursed: mostCursed || null,
    freeSpirits: freeSpiritCandidates.map(c => c.user),
    bettingProphet: {
      user: bettingProphetUser,
      successRate: maxRate !== -1 ? `${(maxRate * 100).toFixed(2)}%` : '0%'
    }
  };
};