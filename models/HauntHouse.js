import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { 
    type: String, 
    enum: ['Head Haunter', 'Senior Spook', 'Spirit', 'Poltergeist'], 
    default: 'Spirit' 
  }
}, { _id: false });

const hauntHouseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  theme: { 
    type: String, 
    required: true, 
    enum: ['Darkness', 'Comedy', 'Terror', 'Corporate'] 
  },
  description: { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false },
  inviteCode: { type: String, default: null },
  members: [memberSchema]
}, { timestamps: true });

export default mongoose.model('HauntHouse', hauntHouseSchema);