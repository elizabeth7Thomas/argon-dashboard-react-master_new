import React from "react";
import axios from "axios";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function ClientesList({ clientes = [], onEdit, onDelete, onView }) {
  const token = localStorage.getItem("token");

  const handleDelete = async (cliente) => {
    const confirm = window.confirm(`¿Seguro que deseas eliminar a ${cliente.nombreCliente}?`);
    if (!confirm) return;

    try {
      await axios.put(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: {
            uri: `pagos/cliente/eliminar/${cliente._id}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onDelete(); // esto viene de props y recarga lista, perfecto
    } catch (error) {
      alert("Error al eliminar el cliente.");
      console.error(error);
    }
  };

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>NIT</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <tr key={cliente._id}>
              <td>{cliente.nombreCliente}</td>
              <td>{cliente.apellidosCliente}</td>
              <td>{cliente.nit}</td>
              <td>
                <Button color="info" onClick={() => onView(cliente)}>
                  <FontAwesomeIcon icon={faEye} />
                </Button>{" "}
                <Button color="warning" onClick={() => onEdit(cliente)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>{" "}
                <Button color="danger" onClick={() => handleDelete(cliente)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No hay clientes registrados
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
