import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'HauntHouse', required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Auction', auctionSchema);