import axiosInstance from './axios';

export const getScene = (gameId, sceneKey) => {
  return axiosInstance.get(`/games/${gameId}/scenes/${sceneKey}`);
};

export const createScene = (gameId, scene) => {
  return axiosInstance.post(`/games/${gameId}/scenes`, scene);
};

export const deleteScene = (id) => {
  return axiosInstance.delete(`/scenes/${id}`);
};