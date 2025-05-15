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
    
        const response = await axios.get("http://localhost:3001/clientes/obtener");
        const clientesData = response.data.clientes || [];  
        setClientes(clientesData); 
      } catch (error) {
        console.error("Error al cargar los clientes", error);
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
      console.error("Error al eliminar el cliente", error);
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
