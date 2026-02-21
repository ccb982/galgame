import axiosInstance from './axios';

export const getSaves = (gameId, visitorId) => {
  return axiosInstance.get(`/saves?gameId=${gameId}&visitorId=${visitorId}`);
};

export const createSave = (save) => {
  return axiosInstance.post('/saves', save);
};

export const updateSave = (id, save) => {
  return axiosInstance.put(`/saves/${id}`, save);
};

export const deleteSave = (id) => {
  return axiosInstance.delete(`/saves/${id}`);
};