// src/Payment/Devoluciones/DevolucionesList.js
import React from "react";
import { Table } from "reactstrap";

export default function DevolucionesList({ devoluciones }) {
  if (!devoluciones.length) {
    return <p>No hay devoluciones registradas.</p>;
  }

  return (
    <Table striped responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>NoDevolución</th>
          <th>NoTransacción</th>
          <th>Monto</th>
          <th>Descripción</th>
          <th>Nota Crédito</th>
          <th>NoAutorización</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {devoluciones.map((dev, index) => (
          <tr key={dev.NoDevolucion}>
            <td>{index + 1}</td>
            <td>{dev.NoDevolucion}</td>
            <td>{dev.NoTransaccion}</td>
            <td>{parseFloat(dev.Monto).toFixed(2)}</td>
            <td>{dev.Descripcion}</td>
            <td>{dev.NotaCredito}</td>
            <td>{dev.NoAutorizacion}</td>
            <td>{new Date(dev.Fecha).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
