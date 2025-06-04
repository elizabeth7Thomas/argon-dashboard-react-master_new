
import React from 'react';

const CierreCajaDetail = ({ cierre }) => {
  return (
    <div className="mt-4 border p-3 rounded">
      <h5>Detalle del Cierre</h5>
      <p><strong>Fecha:</strong> {new Date(cierre.Fecha).toLocaleDateString()}</p>
      <p><strong>Caja:</strong> {cierre.IdCaja}</p>
      <p><strong>Servicio:</strong> {cierre.Servicio}</p>
      <p><strong>Total Día:</strong> {cierre.TotalDia}</p>
      <p><strong>Empleado:</strong> {cierre.Empleado?.NombreCompleto || 'No disponible'}</p>
    </div>
  );
};

export default CierreCajaDetail;
