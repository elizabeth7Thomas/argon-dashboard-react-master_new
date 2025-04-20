// src/Gasoline/Sales/SaleList.js
import React from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SaleList({ sales, onEdit, onDelete }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad (L)</th>
          <th>Fecha</th>
          <th>Monto ($)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale) => (
          <tr key={sale.id}>
            <td>{sale.producto}</td>
            <td>{sale.cantidad}</td>
            <td>{sale.fecha}</td>
            <td>
              <Badge color="success">${sale.monto}</Badge>
            </td>
            <td>
              <Button
                color="warning"
                size="sm"
                onClick={() => onEdit(sale)}
                className="mr-2"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => onDelete(sale.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
