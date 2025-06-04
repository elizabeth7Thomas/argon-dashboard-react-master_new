// src/Payment/Transacciones/TransaccionList.js

import React from "react";
import { Table, Button } from "reactstrap";

export default function TransaccionList({ transacciones = [], onAnular }) {
  return (
    <Table responsive hover className="mt-4">
      <thead>
        <tr>
          <th>No. Transacción</th>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Servicio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {transacciones.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">No hay transacciones.</td>
          </tr>
        ) : (
          transacciones.map((tx) => (
            <tr key={tx.NoTransaccion}>
              <td>{tx.NoTransaccion}</td>
              <td>{new Date(tx.Fecha).toLocaleString()}</td>
              <td>{tx.Monto}</td>
              <td>{tx.Servicio}</td>
              <td>{tx.Estado}</td>
              <td>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => onAnular(tx.NoTransaccion)}
                >
                  Anular
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
