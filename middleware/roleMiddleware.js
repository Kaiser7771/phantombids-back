import HauntHouse from '../models/HauntHouse.js';

/**
 * Middleware para verificar si el usuario tiene un rol global ('admin') 
 * o un rol específico dentro de la casa embrujada (ej. 'Head Haunter', 'Senior Spook', etc.)
 * @param {Array<string>} allowedRoles - Lista de nombres de roles permitidos
 */
export const verifyHouseRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // 1. Verificación global: Si el usuario es administrador, tiene acceso total
      if (req.user && req.user.role === 'admin') {
        return next();
      }

      // Obtenemos el ID de la casa desde los parámetros de la ruta o del body
      const houseId = req.params.id || req.params.houseId || req.body.hauntHouseId;
      const userId = req.user.id; // Viene del token JWT decodificado

      if (!houseId) {
        return res.status(400).json({ message: 'Se requiere el ID de la casa embrujada para validar los permisos.' });
      }

      // Buscamos la casa embrujada en la base de datos
      const house = await HauntHouse.findById(houseId);
      if (!house) {
        return res.status(404).json({ message: 'Casa embrujada no encontrada.' });
      }

      // Buscamos al usuario dentro de los miembros de la casa por su ID
      const member = house.members.find(m => m.user.toString() === userId);

      // Si no es miembro, denegamos el acceso
      if (!member) {
        return res.status(403).json({ message: 'Acceso denegado. No eres miembro de esta casa embrujada.' });
      }

      // Validamos explícitamente el nombre del rol del miembro (ej. 'Head Haunter', 'Senior Spook', etc.)
      const userRoleName = member.role; 

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRoleName)) {
        return res.status(403).json({ 
          message: `Acceso denegado. Tu rol actual es '${userRoleName}', y se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}.` 
        });
      }

      // Adjuntamos la casa a la petición para usarla en el siguiente controlador si se requiere
      req.house = house;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error interno al validar el rol del usuario.', error: error.message });
    }
  };
};