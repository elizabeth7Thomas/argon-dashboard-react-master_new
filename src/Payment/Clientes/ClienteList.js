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
          <th>Apellidos</th>
          <th>NIT</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>No. Tarjeta</th>
          <th>Puntos</th>
          <th>Expira</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center">No se encontraron clientes.</td>
          </tr>
        ) : (
          clientes.map((cliente) => {
            const tarjeta = cliente.tarjetaFidelidad?.[0] || {};
            return (
              <tr key={cliente._id}>
                <td>{cliente.nombreCliente}</td>
                <td>{cliente.apellidosCliente}</td>
                <td>{cliente.nit}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{tarjeta.noTarjeta || "—"}</td>
                <td>{tarjeta.cantidadPuntos ?? "—"}</td>
                <td>
                  {tarjeta.fechaExpiracion
                    ? new Date(tarjeta.fechaExpiracion).toLocaleDateString()
                    : "—"}
                </td>
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
            );
          })
        )}
      </tbody>
    </Table>
  );
}

export default function ClientesForm() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "pagos/cliente/obtener" },
            request: {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data?.response?.data?.clientes;
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.warn("La respuesta del servidor no contiene una lista válida.");
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
