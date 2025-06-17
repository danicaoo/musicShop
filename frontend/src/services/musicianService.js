import api from '../api'; // Используем настроенный экземпляр axios

export const createMusician = async (musicianData) => {
  const response = await api.post('/musicians', musicianData);
  return response.data;
};

export const updateMusician = async (id, musicianData) => {
  const response = await api.put(`/musicians/${id}`, musicianData);
  return response.data;
};

export const getAllMusicians = async () => {
  const response = await api.get('/musicians');
  return response.data;
};

export const getMusicianById = async (id) => {
  const response = await api.get(`/musicians/${id}`);
  return response.data;
};

export const searchMusicians = async (query) => {
  try {
    const response = await api.get('/musicians/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    // Обработка ошибки короткого запроса
    if (error.response && error.response.status === 400 && 
        error.response.data?.error === 'Query must be at least 2 characters') {
      return [];
    }
    
    // Обработка других ошибок
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Request setup error');
    }
  }
};