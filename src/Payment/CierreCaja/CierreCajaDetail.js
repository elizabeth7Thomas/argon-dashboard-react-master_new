import React from 'react';
import { Badge } from 'reactstrap';

const CierreCajaDetail = ({ cierre }) => {
  if (!cierre) return null;

  // Función para mostrar el nombre del servicio
  const getNombreServicio = (servicio) => {
    const servicios = {
      '4': 'Gasolineria',
      // Agrega otros servicios si existen
    };
    return servicios[servicio] || servicio;
  };

  return (
    <div className="mt-4 border p-3 rounded bg-light">
      <h5 className="mb-3">Detalle del Cierre</h5>
      <div className="row">
        <div className="col-md-6">
          <p><strong>Fecha:</strong> {new Date(cierre.Fecha).toLocaleString()}</p>
          <p><strong>Caja:</strong> {cierre.IdCaja}</p>
          <p><strong>Servicio:</strong> {getNombreServicio(cierre.Servicio)}</p>
        </div>
        <div className="col-md-6">
          <p><strong>Total Día:</strong> Q{cierre.TotalDia?.toFixed(2)}</p>
          <p><strong>Retiro:</strong> Q{cierre.Retiro?.toFixed(2)}</p>
          <p>
            <strong>Empleado:</strong> {cierre.Empleado?.NombreCompleto || 'No disponible'}
            {cierre.Empleado?.IdEmpleado && (
              <Badge color="info" className="ml-2">
                ID: {cierre.Empleado.IdEmpleado}
              </Badge>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CierreCajaDetail;