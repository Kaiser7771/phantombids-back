import CursedObject from '../models/CursedObject.js';

export const createCursedObjectService = async (data) => {
  const { minBid, maxBid } = data;
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
  return await CursedObject.find();
};

export const getCursedObjectByIdService = async (id) => {
  const obj = await CursedObject.findById(id);
  if (!obj) {
    const error = new Error('Objeto maldito no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return obj;
};