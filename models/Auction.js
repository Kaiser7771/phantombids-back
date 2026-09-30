import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alias: { type: String, required: true }, // [Adjective]_[Number]
  amount: { type: Number, required: true },
  isDuplicate: { type: Boolean, default: false }
}, { timestamps: true });

const auctionSchema = new mongoose.Schema({
  hauntHouse: { type: mongoose.Schema.Types.ObjectId, ref: 'HauntHouse', required: true },
  cursedObject: { type: mongoose.Schema.Types.ObjectId, ref: 'CursedObject', required: true },
  status: { type: String, enum: ['open', 'closed', 'cancelled'], default: 'open' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  bids: [bidSchema],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  winningBid: { type: Number, default: null }
}, { timestamps: true });

export default mongoose.model('Auction', auctionSchema);