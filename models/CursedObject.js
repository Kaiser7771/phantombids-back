import mongoose from 'mongoose';

const PREDEFINED_CURSES = [
  'LOSE_10_REP',
  'BAN_NEXT_2_AUCTIONS',
  'CURSE_MARK_7_DAYS',
  'REDUCE_BET_LIMIT',
  'POLTERGEIST_24H',
  'PUBLIC_SHAME_ROLE',
  'REPUTATION_DRAIN_PER_DAY',
  'SILENCE_IN_HOUSE'
];

const cursedObjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  baseCurse: { type: String, required: true, enum: PREDEFINED_CURSES },
  minBid: { type: Number, required: true, min: 1, max: 100 },
  maxBid: { type: Number, required: true },
  durationDays: { type: Number, required: true, min: 1, max: 7 },
  // Relación obligatoria con la casa de subastas (HauntHouse)
  house: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'HauntHouse', 
    required: true 
  },
  // Estado de la subasta del objeto para el ciclo de vida (OPEN, CLOSED, CANCELLED)
  status: { 
    type: String, 
    enum: ['OPEN', 'CLOSED', 'CANCELLED'], 
    default: 'OPEN' 
  },
  winner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  winningBidAmount: { 
    type: Number, 
    default: null 
  }
}, { timestamps: true });

export default mongoose.model('CursedObject', cursedObjectSchema);