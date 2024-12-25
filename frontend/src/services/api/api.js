import axios from "axios";
import { envConf } from "../../envConfig";

const { apiBaseUrl } = envConf;

export const authApi = axios.create({
  baseURL: `${apiBaseUrl}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    language: "En",
  },
  withCredentials: false,
  responseType: "json",
});

export const api = axios.create({
  baseURL: `${apiBaseUrl}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  responseType: "json",
});

const applyRequestInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers = config.headers ?? {};
      config.params = config.params || {};
      const token = localStorage.getItem("token");
      const auth = token ? `Bearer ${token}` : "";
      config.headers.Authorization = auth;
      return config;
    },
    (error) => {
      localStorage.clear();
      return Promise.reject(error);
    }
  );
};

const applyResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        window.location.href = `${window.location.origin}/`;
      }
      return Promise.reject(error);
    }
  );
};

applyRequestInterceptor(api);
applyResponseInterceptor(api);