import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Корректный базовый URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов
api.interceptors.request.use(config => {
  console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Перехватчик ошибок
api.interceptors.response.use(
  response => response,
  error => {
    let message = 'Network error';
    
    if (error.response) {
      message = `API Error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`;
    } else if (error.request) {
      message = 'No response from server';
    }
    
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message
    });
    
    return Promise.reject(message);
  }
);

export default api;