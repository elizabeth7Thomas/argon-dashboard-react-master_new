// src/Admin/routes.js

const API_BASE = "http://localhost:3000/administracion";

const EMPLEADOS_API = {
  GET_ALL: `${API_BASE}/GET/empleados`,
  CREATE: `${API_BASE}/POST/empleados`,
  UPDATE: (id) => `${API_BASE}/PUT/empleados/${id}`,
  DELETE: (id) => `${API_BASE}/PATCH/empleados/${id}`,
};

const ROLES_API = {
  GET_ALL: `${API_BASE}/GET/roles`,
  CREATE: `${API_BASE}/POST/roles`,
  UPDATE: (id) => `${API_BASE}/PUT/roles/${id}`,
  DELETE: (id) => `${API_BASE}/PATCH/roles/${id}`,
};

const ALERTAS_API = {
  GET_ALL: `${API_BASE}/GET/alertas`,
  CREATE_TIENDA: `${API_BASE}/POST/alertas/tienda_de_conveniencia`,
  CREATE_GAS: `${API_BASE}/POST/alertas/gasolinera`,
  CREATE_REPUESTOS: `${API_BASE}/POST/alertas/repuestos`,
  CREATE_PINTURA: `${API_BASE}/POST/alertas/pintura`,
  DELETE: (id) => `${API_BASE}/PATCH/alertas/${id}`, 
};

const AREAS_API = {
  GET_ALL: `${API_BASE}/GET/areas`,
  CREATE: `${API_BASE}/POST/areas`,
  DELETE: (id) => `${API_BASE}/PATCH/areas/${id}`,
}

const JORNADAS_API = {
  GET_ALL: `${API_BASE}/GET/jornadas`,
};

const PROVEEDORES_API = {
  GET_ALL: `${API_BASE}/GET/proveedores`,
  CREATE: `${API_BASE}/POST/proveedores`,
  UPDATE: (id) => `${API_BASE}/PUT/proveedores/${id}`,
  DELETE: (id) => `${API_BASE}/PATCH/proveedores/${id}`,
};

const SERVICES_API = {
  GET_ALL: `${API_BASE}/GET/servicios`,
};

const MOVIMIENTOS_API = {
  GET_ALL_TYPE: `${API_BASE}/GET/tipo_movimientos`,
}

const REPORTES_API = {
  GET_ALL: `${API_BASE}/GET/movimientos`,
  GET_ALL_D: `${API_BASE}/GET/movimientos/diarios`,
  GET_ALL_M: `${API_BASE}/GET/movimientos/mensuales`,
  GET_ALL_T: `${API_BASE}/GET/movimientos/trimestrales`,
  GET_ALL_S: `${API_BASE}/GET/movimientos/semanales`,
  GET_ALL_A: `${API_BASE}/GET/movimientos/anuales`,
  
};

const ORDENES_API = {
  GET_ALL: `${API_BASE}/GET/ordenes`,
  GET_BY_ID: (id) => `${API_BASE}/GET/ordenes/${id}`,
  CREATE: `${API_BASE}/POST/ordenes`,
  UPDATE_ESTADO: (id) => `${API_BASE}/PUT/ordenes/modificar_estado/${id}`,
  UPDATE_DETALLE: (id_detalle_orden) => `${API_BASE}/PUT/ordenes/detalle/${id_detalle_orden}`,
  REABASTECER: (id_orden) => `${API_BASE}/POST/ordenes/reabastecer/${id_orden}`,
  GET_ESTADOS_ORDENES: `${API_BASE}/GET/ordenes/estados_ordenes`,
  GET_ESTADOS_ORDENES_DETALLES: `${API_BASE}/GET/ordenes/estados_ordenes_detalles`,
};
const routes = {
  Administracion: {
    Empleados: EMPLEADOS_API,
    Roles: ROLES_API,
    Alertas: ALERTAS_API,
    Areas: AREAS_API,
    Jornadas: JORNADAS_API,
    Proveedores: PROVEEDORES_API,
    Servicios: SERVICES_API,
    Movimientos: MOVIMIENTOS_API,
    Reportes: REPORTES_API,
    Ordenes: ORDENES_API,
  }
};

export default routes;
