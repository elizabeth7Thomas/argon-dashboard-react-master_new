// src/gasoline/Sales/CartForm.js
import React from "react";
import { Table, Button } from "reactstrap";

export default function CartForm({ sales, onSelect }) {
  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Monto</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale) => (
          <tr key={sale.id}>
            <td>{sale.producto}</td>
            <td>{sale.cantidad}</td>
            <td>${sale.monto}</td>
            <td>
              <Button color="primary" size="sm" onClick={() => onSelect(sale)}>
                Agregar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
