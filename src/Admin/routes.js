// src/Admin/routes.js

const API_BASE = "http://64.23.169.22:3761/broker/api/rest";

const EMPLEADOS_API = {
  GET_ALL: "administracion/GET/empleados",
  CREATE: "administracion/POST/empleados",
  UPDATE: (id) => `administracion/PUT/empleados/${id}`,
  DELETE: (id) => `administracion/PATCH/empleados/${id}`,
};

const ROLES_API = {
  GET_ALL: "administracion/GET/roles",
  CREATE: "administracion/POST/roles",
  UPDATE: (id) => `administracion/PUT/roles/${id}`,
  DELETE: (id) => `administracion/PATCH/roles/${id}`,
};

const ALERTAS_API = {
  GET_ALL: "administracion/GET/alertas",
  CREATE_TIENDA: "administracion/POST/alertas/tienda_de_conveniencia",
  CREATE_GAS: "administracion/POST/alertas/gasolinera",
  CREATE_REPUESTOS: "administracion/POST/alertas/repuestos",
  CREATE_PINTURA: "administracion/POST/alertas/pintura",
  DELETE: (id) => `administracion/PATCH/alertas/${id}`,
};

const AREAS_API = {
  GET_ALL: "administracion/GET/areas",
  CREATE: "administracion/POST/areas",
  DELETE: (id) => `administracion/PATCH/areas/${id}`,
};

const JORNADAS_API = {
  GET_ALL: "administracion/GET/jornadas",
};

const PROVEEDORES_API = {
  GET_ALL: "administracion/GET/proveedores",
  CREATE: "administracion/POST/proveedores",
  UPDATE: (id) => `administracion/PUT/proveedores/${id}`,
  DELETE: (id) => `administracion/PATCH/proveedores/${id}`,
};

const SERVICIOS_API = {
  GET_ALL: "administracion/GET/servicios",
};

const MOVIMIENTOS_API = {
  GET_ALL: "administracion/GET/movimientos",
  GET_DIARIO: "administracion/GET/movimientos/diarios",
  GET_MENSUAL: "administracion/GET/movimientos/mensuales",
  GET_TRIMESTRAL: "administracion/GET/movimientos/trimestrales",
  GET_SEMESTRAL: "administracion/GET/movimientos/semestrales",
  GET_ANUAL: "administracion/GET/movimientos/anuales",
};

const ORDENES_API = {
  GET_ALL: "administracion/GET/ordenes",
  GET_BY_ID: (id) => `administracion/GET/ordenes/${id}`,
  CREATE: "administracion/POST/ordenes",
  UPDATE_ESTADO: (id) => `administracion/PUT/ordenes/modificar_estado/${id}`,
  UPDATE_DETALLE: (id_detalle_orden) => `administracion/PUT/ordenes/detalle/${id_detalle_orden}`,
  REABASTECER: (id_orden) => `administracion/POST/ordenes/reabastecer/${id_orden}`,
  GET_ESTADOS_ORDENES: "administracion/GET/ordenes/estados_ordenes",
  GET_ESTADOS_ORDENES_DETALLES: "administracion/GET/ordenes/estados_ordenes_detalles",
};

const routes = {
  API_BASE,
  Administracion: {
    Empleados: EMPLEADOS_API,
    Roles: ROLES_API,
    Alertas: ALERTAS_API,
    Areas: AREAS_API,
    Jornadas: JORNADAS_API,
    Proveedores: PROVEEDORES_API,
    Servicios: SERVICIOS_API,
    Movimientos: MOVIMIENTOS_API,
    Ordenes: ORDENES_API,
  }
};

export default routes;
