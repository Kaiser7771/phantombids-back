import express from 'express';
import HauntHouse from '../models/HauntHouse.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/houses - Obtener todas las casas
router.get('/', async (req, res) => {
  try {
    const houses = await HauntHouse.find().populate('owner', 'username email');
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las casas.', error: error.message });
  }
});

// GET /api/houses/:id - Obtener una casa por ID
router.get('/:id', async (req, res) => {
  try {
    const house = await HauntHouse.findById(req.params.id).populate('owner', 'username email');
    if (!house) {
      return res.status(404).json({ message: 'Casa embrujada no encontrada.' });
    }
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la casa.', error: error.message });
  }
});

// POST /api/houses - Crear una nueva casa (Protegido por Token)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, location, spookinessLevel, pricePerNight, imageUrl } = req.body;

    const newHouse = new HauntHouse({
      title,
      description,
      location,
      spookinessLevel,
      pricePerNight,
      imageUrl,
      owner: req.user.id // Extraído del token por el middleware
    });

    await newHouse.save();
    res.status(201).json({ message: 'Casa embrujada creada exitosamente.', house: newHouse });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la casa.', error: error.message });
  }
});

export default router;