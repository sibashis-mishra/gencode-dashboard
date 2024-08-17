// src/utils/api.js
import axios from "axios";

axios.defaults.withCredentials = true;

// Axios instance for authenticated requests
const authApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for non-authenticated requests
const nonAuthApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to authApi to include the token in every request
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility functions for GET requests
export const get = async (url, authenticated = true) => {
  try {
    const response = await (authenticated
      ? authApi.get(url)
      : nonAuthApi.get(url));
    return response;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

// Utility functions for POST requests
export const post = async (url, data, authenticated = true) => {
  try {
    const response = await (authenticated
      ? authApi.post(url, data)
      : nonAuthApi.post(url, data));
    return response;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

// Utility functions for DELETE requests
export const del = async (url, authenticated = true) => {
  try {
    const response = await (authenticated
      ? authApi.delete(url)
      : nonAuthApi.delete(url));
    return response;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

// Utility functions for PUT requests
export const put = async (url, data, authenticated = true) => {
  try {
    const response = await (authenticated
      ? authApi.put(url, data)
      : nonAuthApi.put(url, data));
    return response;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};
