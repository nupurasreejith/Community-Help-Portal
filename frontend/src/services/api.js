import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Automatically attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Automatically refresh expired access tokens
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('token/')
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh: refreshToken }
          );

          localStorage.setItem('accessToken', response.data.access);

          originalRequest.headers.Authorization =
            `Bearer ${response.data.access}`;

          return API(originalRequest);

        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;