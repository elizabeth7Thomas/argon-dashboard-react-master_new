import React from "react";
import { Table, Button } from "reactstrap";

export default function TransaccionList({ transacciones, onEdit, onDelete, onView }) {
  return (
    <Table striped bordered responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Cliente</th>
          <th>Método de Pago</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {transacciones.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">
              No hay transacciones registradas.
            </td>
          </tr>
        ) : (
          transacciones.map((trans, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{trans.Cliente}</td>
              <td>{trans.MetodoPago}</td>
              <td>{trans.Monto}</td>
              <td>{trans.Fecha}</td>
              <td>
                <Button color="info" size="sm" onClick={() => onView(trans)}>
                  Ver
                </Button>{" "}
                <Button color="warning" size="sm" onClick={() => onEdit(trans)}>
                  Editar
                </Button>{" "}
                <Button color="danger" size="sm" onClick={() => onDelete(trans)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

