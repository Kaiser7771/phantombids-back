import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetAlias: { type: String, required: true },
  amount: { type: Number, required: true, enum: [5, 10, 25, 50] },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Bet', betSchema);