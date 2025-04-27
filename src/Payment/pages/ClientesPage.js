// src/payment/pages/ClientesPage.js
import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Button } from "reactstrap";
import HeaderClients from "../../components/Headers/HeaderClients";
import ClienteForm from "../Clientes/ClienteForm";
import ClienteList from "../Clientes/ClienteList";
import ClienteDetail from "../Clientes/ClienteDetail";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  // Mock inicial de clientes para diseño
  useEffect(() => {
    const mockClientes = [
      { id: 1, nombre: "Juan Pérez", email: "juan@example.com", telefono: "123456789" },
      { id: 2, nombre: "Ana Gómez", email: "ana@example.com", telefono: "987654321" },
    ];
    setClientes(mockClientes);
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleDetail = () => setDetailOpen(!detailOpen);

  const handleCreate = () => {
    setFormData({ nombre: "", email: "", telefono: "" });
    setIsEditing(false);
    toggleModal();
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
    setSelectedCliente(cliente);
    setIsEditing(true);
    toggleModal();
  };

  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    toggleDetail();
  };

  const handleDelete = (cliente) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${cliente.nombre}?`)) {
      const updatedClientes = clientes.filter(c => c.id !== cliente.id);
      setClientes(updatedClientes);
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      const updatedClientes = clientes.map(c =>
        c.id === formData.id ? formData : c
      );
      setClientes(updatedClientes);
    } else {
      const nuevoCliente = {
        ...formData,
        id: Date.now(), // Genera ID único temporal
      };
      setClientes([...clientes, nuevoCliente]);
    }
    toggleModal();
  };

  return (
    <>
      <HeaderClients />
      <Container className="mt--6" fluid>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end mb-3">
              <Button color="primary" onClick={handleCreate}>
                Nuevo Cliente
              </Button>
            </div>
            <ClienteList
              clientes={clientes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </CardBody>
        </Card>
      </Container>

      <ClienteForm
        isOpen={modalOpen}
        toggle={toggleModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />

      <ClienteDetail
        isOpen={detailOpen}
        toggle={toggleDetail}
        cliente={selectedCliente}
      />
    </>
  );
}
