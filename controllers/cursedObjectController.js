import { 
  createCursedObjectService, 
  getAllCursedObjectsService, 
  getCursedObjectByIdService 
} from '../services/cursedObjectService.js';

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