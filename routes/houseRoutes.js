import { Router } from 'express';
import HauntHouse from '../models/HauntHouse.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyHouseRole } from '../middleware/roleMiddleware.js';

const router = Router();

// GET /api/houses - Obtener TODAS las casas (públicas y privadas visibles para todos)
router.get('/', async (req, res) => {
  try {
    const houses = await HauntHouse.find().populate('members.user', 'username email role');
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las casas.', error: error.message });
  }
});

// GET /api/houses/:id - Obtener detalle de la casa (Con diagnóstico de token)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // 1. Ver qué datos está inyectando verifyToken
    console.log("--- DEBUGGING /houses/:id ---");
    console.log("req.user recibido:", req.user);

    const house = await HauntHouse.findById(req.params.id).populate('members.user', 'username email role');
    
    if (!house) {
      return res.status(404).json({ message: 'Casa embrujada no encontrada.' });
    }

    if (house.isPrivate) {
      // Tomamos el ID del usuario de la forma en que venga en el token
      const currentUserId = req.user?.userId || req.user?.id || req.user?._id;
      
      if (!currentUserId) {
        console.log("❌ Error: No se encontró un ID de usuario válido en req.user");
        return res.status(401).json({ message: 'Token inválido o sin ID de usuario.' });
      }

      // Consulta directa a la base de datos para verificar el rol real
      const userRecord = await User.findById(currentUserId);
      console.log("Usuario encontrado en BD:", userRecord);

      const userRole = (userRecord?.role || req.user?.role || '').toLowerCase();
      const isAdmin = userRole === 'admin' || req.user?.isAdmin === true;

      const isMember = house.members.some((member) => {
        if (!member.user) return false;
        const memberId = member.user._id ? member.user._id.toString() : member.user.toString();
        return memberId === currentUserId.toString();
      });

      console.log(`Resultado final -> ¿Es Admin?: ${isAdmin} | ¿Es Miembro?: ${isMember}`);

      if (!isAdmin && !isMember) {
        return res.status(403).json({ 
          message: 'Acceso denegado: Esta casa es privada y requiere permisos de Administrador o invitación.' 
        });
      }
    }

    res.json(house);
  } catch (error) {
    console.error("❌ Error en GET /houses/:id:", error);
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
      members: [{ user: req.user.userId || req.user.id, role: 'Head Haunter' }]
    });

    await newHouse.save();
    res.status(201).json({ message: 'Casa embrujada creada exitosamente.', house: newHouse });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la casa.', error: error.message });
  }
});

// PUT /api/houses/:id - Actualizar una casa (Solo Head Haunter o Admin)
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

// DELETE /api/houses/:id - Eliminar una casa (Solo Head Haunter o Admin)
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