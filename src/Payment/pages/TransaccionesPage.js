import React, { useState } from "react";
import { Container, Card, CardBody, Button } from "reactstrap";

import TransaccionList from "../Transacciones/TransaccionList";
import TransaccionForm from "../Transacciones/TransaccionForm";
import TransaccionDetail from "../Transacciones/TransaccionDetail";

export default function TransaccionesPage() {
  const [transacciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);
  const [formData, setFormData] = useState({
    Cliente: "",
    MetodoPago: "",
    Monto: "",
    Fecha: "",
  });

  const handleCreate = () => {
    setFormData({
      Cliente: "",
      MetodoPago: "",
      Monto: "",
      Fecha: "",
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (transaccion) => {
    setFormData(transaccion);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleView = (transaccion) => {
    setSelectedTransaccion(transaccion);
    setDetailOpen(true);
  };

  const handleDelete = (transaccion) => {
    alert(`Eliminar transacción: ${transaccion.Cliente}`);
  };

  const handleSubmit = () => {
    alert(isEditing ? "Editar transacción" : "Crear nueva transacción");
    setModalOpen(false);
  };

  return (
    <>
      <br></br> <br></br>
      <br></br><br></br>
      <Container className="mt--6" fluid>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end mb-3">
              
            </div>
            <TransaccionList
              transacciones={transacciones}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </CardBody>
        </Card>
      </Container>

      <TransaccionForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />

      <TransaccionDetail
        isOpen={detailOpen}
        toggle={() => setDetailOpen(!detailOpen)}
        transaccion={selectedTransaccion}
      />
      <Button color="primary" onClick={handleCreate}>
                Nueva Transacción
              </Button>
    </>
  );
}
