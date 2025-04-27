// src/payment/Clientes/ClienteList.js
import React from "react";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function ClienteList({ clientes, onEdit, onDelete, onView }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id}>
            <td>{cliente.nombre}</td>
            <td>{cliente.email}</td>
            <td>{cliente.telefono}</td>
            <td>
              <Button size="sm" color="info" className="mr-2" onClick={() => onView(cliente)}>
                <FontAwesomeIcon icon={faEye} />
              </Button>
              <Button size="sm" color="warning" className="mr-2" onClick={() => onEdit(cliente)}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button size="sm" color="danger" onClick={() => onDelete(cliente)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
