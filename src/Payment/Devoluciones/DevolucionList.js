import React from "react";
import { Table } from "reactstrap";

export default function DevolucionesList({ devoluciones = [] }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>NoDevolución</th>
          <th>NoTransacción</th>
          <th>Monto</th>
          <th>Descripción</th>
          <th>NoAutorización</th>
          <th>Nota Crédito</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {devoluciones.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center">No hay devoluciones.</td>
          </tr>
        ) : (
          devoluciones.map((dev) => (
            <tr key={dev.NoDevolucion}>
              <td>{dev.NoDevolucion}</td>
              <td>{dev.NoTransaccion}</td>
              <td>{dev.Monto}</td>
              <td>{dev.Descripcion}</td>
              <td>{dev.NoAutorizacion}</td>
              <td>{dev.NotaCredito}</td>
              <td>{new Date(dev.Fecha).toLocaleString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
