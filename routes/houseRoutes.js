import { Router } from 'express';
import HauntHouse from '../models/HauntHouse.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyHouseRole } from '../middleware/roleMiddleware.js';

const router = Router();

// GET /api/houses - Obtener todas las casas
router.get('/', async (req, res) => {
  try {
    const houses = await HauntHouse.find().populate('members.user', 'username email');
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las casas.', error: error.message });
  }
});

// GET /api/houses/:id - Obtener una casa por ID
router.get('/:id', async (req, res) => {
  try {
    const house = await HauntHouse.findById(req.params.id).populate('members.user', 'username email');
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
    const { name, theme, description, coverImageUrl, isPrivate, inviteCode } = req.body;

    const newHouse = new HauntHouse({
      name,
      theme,
      description,
      coverImageUrl,
      isPrivate,
      inviteCode,
      members: [{ user: req.user.id, role: 'Head Haunter' }]
    });

    await newHouse.save();
    res.status(201).json({ message: 'Casa embrujada creada exitosamente.', house: newHouse });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la casa.', error: error.message });
  }
});

// PUT /api/houses/:id - Actualizar una casa embrujada (Solo Head Haunter o Admin)
router.put('/:id', verifyToken, verifyHouseRole(['Head Haunter']), async (req, res, next) => {
  try {
    const { name, theme, description, coverImageUrl, isPrivate, inviteCode } = req.body;
    
    const updatedHouse = await HauntHouse.findByIdAndUpdate(
      req.params.id,
      { name, theme, description, coverImageUrl, isPrivate, inviteCode },
      { new: true, runValidators: true }
    );

    if (!updatedHouse) {
      return res.status(404).json({ message: 'Casa embrujada no encontrada.' });
    }

    res.json({ message: 'Casa embrujada actualizada con éxito.', house: updatedHouse });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/houses/:id - Eliminar una casa embrujada (Solo Head Haunter o Admin)
router.delete('/:id', verifyToken, verifyHouseRole(['Head Haunter']), async (req, res, next) => {
  try {
    const deletedHouse = await HauntHouse.findByIdAndDelete(req.params.id);

    if (!deletedHouse) {
      return res.status(404).json({ message: 'Casa embrujada no encontrada.' });
    }

    res.json({ message: 'Casa embrujada eliminada exitosamente.' });
  } catch (error) {
    next(error);
  }
});

export default router;