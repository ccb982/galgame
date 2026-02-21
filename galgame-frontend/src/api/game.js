import axiosInstance from './axios';

export const getGames = (page = 0, size = 10) => {
  return axiosInstance.get(`/games?page=${page}&size=${size}`);
};

export const getGameById = (id) => {
  return axiosInstance.get(`/games/${id}`);
};

export const createGame = (game) => {
  return axiosInstance.post('/games', game);
};

export const deleteGame = (id) => {
  return axiosInstance.delete(`/games/${id}`);
};