//ClientList.js
import React from "react";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

function ClientesList({ clientes = [], onEdit, onDelete, onView }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>NIT</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">No se encontraron clientes.</td>
          </tr>
        ) : (
          clientes.map((cliente) => (
            <tr key={cliente._id}>
              <td>{cliente.nombreCliente}</td>
              <td>{cliente.apellidosCliente}</td>
              <td>{cliente.nit}</td>
              <td>{cliente.email}</td>
              <td>{cliente.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <Button size="sm" color="info" className="me-2" onClick={() => onView(cliente)}>
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                <Button size="sm" color="warning" className="me-2" onClick={() => onEdit(cliente)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button size="sm" color="danger" onClick={() => onDelete(cliente)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ClientesList;
