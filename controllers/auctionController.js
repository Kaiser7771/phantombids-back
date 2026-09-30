import { 
  placeBidService, 
  closeAuctionService 
} from '../services/auctionService.js';
import Auction from '../models/Auction.js';

export const createAuction = async (req, res, next) => {
  try {
    const { hauntHouse, cursedObject, durationDays } = req.body;
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (durationDays || 1));

    const newAuction = new Auction({
      hauntHouse,
      cursedObject,
      endDate
    });

    await newAuction.save();
    res.status(201).json({ message: 'Subasta fantasma iniciada.', auction: newAuction });
  } catch (error) {
    next(error);
  }
};

export const placeBid = async (req, res, next) => {
  try {
    const { id: auctionId } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    const result = await placeBidService(auctionId, userId, Number(amount));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const closeAuction = async (req, res, next) => {
  try {
    const { id: auctionId } = req.params;
    const result = await closeAuctionService(auctionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('cursedObject')
      .populate('hauntHouse', 'name theme');

    if (!auction) {
      const error = new Error('Subasta no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    // Ocultar las ofertas reales si la subasta sigue abierta (Mantiene el secreto)
    const auctionData = auction.toObject();
    if (auction.status === 'open') {
      auctionData.bids = auctionData.bids.map(b => ({
        alias: b.alias,
        createdAt: b.createdAt
        // Se omite intencionalmente el 'amount' y 'user'
      }));
    }

    res.json(auctionData);
  } catch (error) {
    next(error);
  }
};