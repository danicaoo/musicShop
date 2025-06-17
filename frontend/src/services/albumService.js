import axios from 'axios';
import api from './api';
const API_URL = "/api";

export const getAlbums = async (page = 1, pageSize = 20) => {
  const response = await api.get('/albums', {
    params: { page, pageSize }
  });
  return response.data;
};

export const getAlbumDetails = async (id) => {
  const response = await api.get(`/albums/${id}`);
  return response.data;
};

export const createAlbum = async (albumData) => {
  const response = await api.post('/albums', albumData);
  return response.data;
};

export const updateAlbum = async (id, albumData) => {
  const response = await axios.put(`${API_URL}/albums/${id}`, albumData);
  return response.data;
};

export const updateInventory = async (id, inventoryData) => {
  const response = await axios.put(`${API_URL}/albums/inventory/${id}`, inventoryData);
  return response.data;
};

export const searchAlbums = async (query) => {
  const response = await api.get('/albums/search', {
    params: { q: query }
  });
  return response.data;
};


export const getTopSellingAlbums = async () => {
  const response = await api.get('/top-selling');
  return response.data;
};
