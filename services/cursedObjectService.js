import CursedObject from '../models/CursedObject.js';

export const createCursedObjectService = async (data) => {
  const { minBid, maxBid, house } = data;

  // Validar que se envíe la casa de subastas
  if (!house) {
    const error = new Error('El objeto debe pertenecer a una casa de subastas.');
    error.statusCode = 400;
    throw error;
  }

  if (maxBid < minBid + 10 || maxBid > 500) {
    const error = new Error('maxBid debe ser al menos minBid + 10 y no exceder 500.');
    error.statusCode = 400;
    throw error;
  }

  const newObject = new CursedObject(data);
  await newObject.save();
  return newObject;
};

export const getAllCursedObjectsService = async () => {
  // Opcional: si quieres que traiga la información de la casa relacionada
  return await CursedObject.find().populate('house');
};

export const getCursedObjectByIdService = async (id) => {
  const obj = await CursedObject.findById(id).populate('house');
  if (!obj) {
    const error = new Error('Objeto maldito no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return obj;
};