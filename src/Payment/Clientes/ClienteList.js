// src/components/ClientesForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

function ClienteList({ clientes, onEdit, onDelete, onView }) {
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
        {clientes.length === 0 ? (
          <tr>
            <td colSpan="4">No se encontraron clientes.</td>
          </tr>
        ) : (
          clientes.map((cliente) => (
            <tr key={cliente._id}>
              <td>{cliente.nombreCliente}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
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

export default function ClientesForm() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      
      try {
        const response = await axios.get("http://localhost:3001/pagos/cliente/obtener", {
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        console.log("Respuesta del servidor:", response);
        console.log("Clientes recibidos:", response.data.clientes);

        if (response.status === 200 && response.data && Array.isArray(response.data.clientes)) {
          setClientes(response.data.clientes);
        } else {
          console.warn("La respuesta del servidor no contiene la lista esperada de clientes.");
          setClientes([]);
        }
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
        alert("Error al cargar los clientes");
      }
    };

    fetchClientes();
  }, []);

  const handleView = (cliente) => {
    alert(`Viendo cliente: ${cliente.nombreCliente}`);
  };

  const handleEdit = (cliente) => {
    alert(`Editando cliente: ${cliente.nombreCliente}`);
  };

  const handleDelete = async (cliente) => {
    try {
      await axios.put(`http://localhost:3001/clientes/eliminar/${cliente._id}`);
      alert(`Cliente ${cliente.nombreCliente} eliminado`);
      setClientes(clientes.filter((c) => c._id !== cliente._id));
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      alert("Hubo un error al eliminar el cliente");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes</h2>
      <ClienteList
        clientes={clientes}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
