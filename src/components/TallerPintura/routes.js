export const API_BASE_URL = "http://localhost:8000/pintura";

export const routes = {
  servicios: {
    get: `${API_BASE_URL}/GET/servicios`,
    post: `${API_BASE_URL}/POST/servicios`
  },
  tiposServicios: {
    get: `${API_BASE_URL}/GET/tiposervicios`,
    post: `${API_BASE_URL}/POST/tiposervicios`
  },
  tiposVehiculos: {
    get: `${API_BASE_URL}/GET/tiposvehiculos`,
    post: `${API_BASE_URL}/POST/tipovehiculos`
  },
  tiposPinturas: {
    get: `${API_BASE_URL}/GET/tipospinturas`,
    post: `${API_BASE_URL}/POST/tipopinturas`
  },
  inventarios: {
    get: `${API_BASE_URL}/GET/inventarios`,
    post: `${API_BASE_URL}/POST/inventarios`
  },
  movimientos: {
    get: `${API_BASE_URL}/GET/movimientos`,
    post: `${API_BASE_URL}/POST/movimientos`
  },
  ventas: {
    get: `${API_BASE_URL}/GET/ventas`,
    post: `${API_BASE_URL}/POST/ventas`
  },
  detalleVentas: {
    get: (idVenta) => `${API_BASE_URL}/GET/detalleventas/${idVenta}`,
    post: `${API_BASE_URL}/POST/detalleventas`
  },
  devoluciones: {
    get: `${API_BASE_URL}/GET/devolucion`,
    post: `${API_BASE_URL}/POST/devolucion`
  },
  vehiculoInventarios: {
    get: `${API_BASE_URL}/GET/vehiculoinventarios`,
    post: `${API_BASE_URL}/POST/vehiculoinventarios`
  },
  precioServicio: {
    get: `${API_BASE_URL}/GET/precioservicio`,
    post: `${API_BASE_URL}/POST/precioservicio`
  }
};
