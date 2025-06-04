import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientesList from "../Clientes/ClienteList";
import ClienteForm from "../Clientes/ClienteForm";
import { Button, Input, Row, Col } from "reactstrap";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nitBusqueda, setNitBusqueda] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchClientes = async () => {
    try {
      const res = await axios.post(
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
      const data = res.data.response?.data?.clientes || [];
      setClientes(data);
      setError("");
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      const brokerMessage = err?.response?.data?.response?.message;
      setError(brokerMessage || "Error al cargar los clientes.");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEdit = (cliente) => {
    setFormData(cliente);
    setIsEditing(true);
    setSelectedId(cliente._id);
    setModalOpen(true);
  };

  const handleDelete = async (cliente) => {
    const confirm = window.confirm(`¿Seguro que deseas eliminar a ${cliente.nombreCliente}?`);
    if (!confirm) return;

    try {
      const res = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/cliente/eliminar/${cliente._id}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const mensaje = res.data.response?.message || "Cliente eliminado exitosamente.";
      alert(mensaje);
      fetchClientes();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      const brokerMessage = err?.response?.data?.response?.message;
      alert(brokerMessage || "Error al eliminar el cliente.");
    }
  };

  const handleView = (cliente) => {
    alert(`Viendo cliente: ${cliente.nombreCliente} ${cliente.apellidosCliente}`);
  };

  const handleSearch = async () => {
    if (!nitBusqueda.trim()) return;
    try {
      const res = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/clientes/obtener/${nitBusqueda}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const cliente = res.data.response?.data?.cliente;
      if (cliente) {
        setClientes([cliente]);
        setError("");
      } else {
        setClientes([]);
        setError("Cliente no encontrado.");
      }
    } catch (err) {
      console.error("Error al buscar cliente:", err);
      const brokerMessage = err?.response?.data?.response?.message;
      setClientes([]);
      setError(brokerMessage || "Error al buscar cliente.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes</h2>

      <Row className="mb-3">
        <Col sm={8}>
          <Input
            placeholder="Buscar por NIT"
            value={nitBusqueda}
            onChange={(e) => setNitBusqueda(e.target.value)}
          />
        </Col>
        <Col sm={4}>
          <Button color="primary" onClick={handleSearch}>
            Buscar
          </Button>{" "}
          <Button
            color="success"
            onClick={() => {
              setFormData({});
              setIsEditing(false);
              setModalOpen(true);
            }}
          >
            Nuevo Cliente
          </Button>
        </Col>
      </Row>

      {error && <p className="text-danger small">{error}</p>}

      <ClientesList
        clientes={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <ClienteForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSuccess={fetchClientes}
        isEditing={isEditing}
        idCliente={selectedId}
      />
    </div>
  );
}
