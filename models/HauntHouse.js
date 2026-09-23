import mongoose from 'mongoose';

const hauntHouseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  spookinessLevel: { type: Number, required: true, min: 1, max: 5 },
  pricePerNight: { type: Number, required: true },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('HauntHouse', hauntHouseSchema);