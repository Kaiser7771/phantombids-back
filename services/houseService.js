import HauntHouse from '../models/HauntHouse.js';

export const createHouseService = async (userId, houseData) => {
  const { name, theme, description, coverImageUrl, isPrivate, inviteCode } = houseData;
  
  const newHouse = new HauntHouse({
    name,
    theme,
    description,
    coverImageUrl,
    isPrivate,
    inviteCode: isPrivate ? inviteCode : null,
    members: [{ user: userId, role: 'Head Haunter' }] // Creador asignado como Head Haunter
  });

  await newHouse.save();
  return newHouse;
};

export const joinHouseService = async (userId, houseId, inviteCode) => {
  const house = await HauntHouse.findById(houseId);
  if (!house) throw new Error('Casa Embrujada no encontrada.');

  const isMember = house.members.some(m => m.user.toString() === userId);
  if (isMember) throw new Error('El usuario ya pertenece a esta casa.');

  if (house.isPrivate) {
    if (!inviteCode || house.inviteCode !== inviteCode) {
      throw new Error('Código de invitación inválido o faltante.');
    }
  }

  house.members.push({ user: userId, role: 'Spirit' }); // Rol por defecto Spirit
  await house.save();
  return { message: 'Te has unido a la casa exitosamente', house };
};

export const getHouseMembersService = async (houseId) => {
  const house = await HauntHouse.findById(houseId).populate('members.user', 'username email reputation avatarUrl');
  if (!house) throw new Error('Casa Embrujada no encontrada.');
  return house.members;
};

export const getAllHousesService = async () => {
  return await HauntHouse.find().select('-inviteCode');
};

export const getHouseByIdService = async (houseId) => {
  const house = await HauntHouse.findById(houseId);
  if (!house) throw new Error('Casa no encontrada.');
  return house;
};