import { 
  createCursedObjectService, 
  getAllCursedObjectsService, 
  getCursedObjectByIdService 
} from '../services/cursedObjectService.js';
import CursedObject from '../models/CursedObject.js';

export const createCursedObject = async (req, res, next) => {
  try {
    const object = await createCursedObjectService(req.body);
    res.status(201).json({ message: 'Objeto maldito creado con éxito.', object });
  } catch (error) {
    next(error);
  }
};

export const getAllCursedObjects = async (req, res, next) => {
  try {
    const objects = await getAllCursedObjectsService();
    res.json(objects);
  } catch (error) {
    next(error);
  }
};

export const getCursedObjectById = async (req, res, next) => {
  try {
    const object = await getCursedObjectByIdService(req.params.id);
    res.json(object);
  } catch (error) {
    next(error);
  }
};

export const deleteCursedObject = async (req, res, next) => {
  try {
    const deletedObject = await CursedObject.findByIdAndDelete(req.params.id);
    if (!deletedObject) {
      return res.status(404).json({ message: 'Objeto maldito no encontrado.' });
    }
    res.json({ message: 'Objeto maldito eliminado con éxito.' });
  } catch (error) {
    next(error);
  }
};

export const updateCursedObject = async (req, res, next) => {
  try {
    const updatedObject = await CursedObject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedObject) {
      return res.status(404).json({ message: 'Objeto maldito no encontrado.' });
    }
    res.json({ message: 'Objeto maldito actualizado con éxito.', object: updatedObject });
  } catch (error) {
    next(error);
  }
};