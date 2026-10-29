import * as houseService from '../services/houseService.js';

export const createHouse = async (req, res) => {
  try {
    const house = await houseService.createHouseService(req.user.userId, req.body);
    return res.status(201).json(house);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const joinHouse = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const result = await houseService.joinHouseService(req.user.userId, req.params.id, inviteCode);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getHouseMembers = async (req, res) => {
  try {
    const members = await houseService.getHouseMembersService(req.params.id);
    return res.status(200).json(members);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const getAllHouses = async (req, res) => {
  try {
    const houses = await houseService.getAllHousesService();
    return res.status(200).json(houses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHouseById = async (req, res) => {
  try {
    const house = await houseService.getHouseByIdService(req.params.id);
    return res.status(200).json(house);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};