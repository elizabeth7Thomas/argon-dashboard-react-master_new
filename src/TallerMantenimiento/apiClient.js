import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://64.23.169.22:3761/broker/api/rest",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token en cada petición
apiClient.interceptors.request.use(
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

export default apiClient;
