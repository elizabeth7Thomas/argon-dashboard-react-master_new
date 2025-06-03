import React from "react";
import { Table, Button } from "reactstrap";

export default function TransaccionList({ transacciones }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>No. Transacción</th>
          <th>No. Autorización</th>
          <th>Fecha</th>
          <th>No. Factura</th>
          <th>Total</th>
          <th>ID Cliente</th>
          <th>ID Caja</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {transacciones?.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center">No se encontraron transacciones.</td>
          </tr>
        ) : (
          transacciones.map((tx) => (
            <tr key={tx.idTransaccion}>
              <td>{tx.NoTransaccion}</td>
              <td>{tx.NoAutorizacion || "—"}</td>
              <td>{tx.Fecha ? new Date(tx.Fecha).toLocaleString() : "—"}</td>
              <td>{tx.NoFactura || "—"}</td>
              <td>{tx.Total}</td>
              <td>{tx.IdCliente || "—"}</td>
              <td>{tx.IdCaja || "—"}</td>
              <td>{tx.Estado}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
