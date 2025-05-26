const API_BASE = "http://localhost:3000/administracion";

export const EMPLEADOS_API = {
  GET_ALL: `${API_BASE}/GET/empleados`,
  CREATE: `${API_BASE}/POST/empleados`,
  UPDATE: (id) => `${API_BASE}/PUT/empleados/${id}`,
  DELETE: (id) => `${API_BASE}/PATCH/empleados/${id}`,
};
