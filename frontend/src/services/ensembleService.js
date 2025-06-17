import axios from 'axios';
import api from '../api'; 

const API_URL = "/api";

export const getCompositionsCount = async (ensembleId) => {
  const response = await api.get(`/ensembles/${ensembleId}/compositions-count`);
  return response.data;
};

export const getEnsembleAlbums = async (ensembleId) => {
  const response = await axios.get(`${API_URL}/ensembles/${ensembleId}/albums`);
  return response.data;
};

export const getTopSellingAlbums = async () => {
  try {
    const response = await api.get('/top-selling');
    return response.data;
  } catch (error) {
    console.error('Error fetching top selling albums:', error);
    throw error;
  }
};

export const createEnsemble = async (ensembleData) => {
  try {
    const response = await axios.post(`${API_URL}/ensembles`, ensembleData);
    return response.data;
  } catch (error) {
    console.error('Error creating ensemble:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllEnsembles = async () => {
  const response = await api.get('/ensembles');
  return response.data;
};