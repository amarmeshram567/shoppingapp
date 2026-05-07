import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "https://shoppingapp-services.vercel.app/api";


// console.log(API_URL)
// console.log(import.meta.env.VITE_API_URL)


export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lior_token");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiRequest = async (path, options = {}) => {
  try {
    const response = await api({
      url: path,
      method: options.method || "GET",
      data: options.body,
      params: options.params,
      headers: options.headers
    });

    return response.data;
  } catch (error) {
    const wrappedError = new Error(error.response?.data?.message || error.message || "Request failed");
    wrappedError.statusCode = error.response?.status;
    toast.error(wrappedError.message);
    throw wrappedError;
  }
};
