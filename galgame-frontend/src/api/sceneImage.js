import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * 上传背景图片（需要 gameId，兼容旧接口）
 * @param {number} gameId - 游戏ID
 * @param {File} file - 图片文件
 * @returns {Promise} - 上传结果
 */
export const uploadBackgroundImage = async (gameId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post(`${API_BASE_URL}/games/${gameId}/scene-images/backgrounds`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 上传角色图片（需要 gameId，兼容旧接口）
 * @param {number} gameId - 游戏ID
 * @param {File} file - 图片文件
 * @returns {Promise} - 上传结果
 */
export const uploadCharacterImage = async (gameId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post(`${API_BASE_URL}/games/${gameId}/scene-images/characters`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 上传背景图片（不需要 gameId）
 * @param {File} file - 图片文件
 * @returns {Promise} - 上传结果
 */
export const uploadBackgroundImageSimple = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post(`${API_BASE_URL}/scene-images/backgrounds`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 上传角色图片（不需要 gameId）
 * @param {File} file - 图片文件
 * @returns {Promise} - 上传结果
 */
export const uploadCharacterImageSimple = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post(`${API_BASE_URL}/scene-images/characters`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};