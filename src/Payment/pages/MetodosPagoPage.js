import React, { useState } from "react";
import { Container, Card, CardBody, Button } from "reactstrap";
import HeaderMetodosPago from "../../components/Headers/HeaderMetodosPago";
import MetodoPagoForm from "../MetodosPago/MetodoPagoForm";
import MetodoPagoList from "../MetodosPago/MetodoPagoList";
import MetodoPagoDetail from "../MetodosPago/MetodoPagoDetail";

export default function MetodosPagoPage() {
  const [metodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const [formData, setFormData] = useState({ Metodo: "" });

  const handleCreate = () => {
    setFormData({ Metodo: "" });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (metodo) => {
    setFormData(metodo);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleView = (metodo) => {
    setSelectedMetodo(metodo);
    setDetailOpen(true);
  };

  const handleDelete = (metodo) => {
    alert(`Simulación de eliminación de método: ${metodo.Metodo}`);
  };

  const handleSubmit = () => {
    alert(isEditing ? "Editar método" : "Crear nuevo método");
    setModalOpen(false);
  };

  return (
    <>
      <HeaderMetodosPago />
      <Container className="mt--6" fluid>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end mb-3">
              <Button color="primary" onClick={handleCreate}>
                Nuevo Método de Pago
              </Button>
            </div>
            <MetodoPagoList
              metodos={metodos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          </CardBody>
        </Card>
      </Container>

      <MetodoPagoForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />

      <MetodoPagoDetail
        isOpen={detailOpen}
        toggle={() => setDetailOpen(!detailOpen)}
        metodo={selectedMetodo}
      />
    </>
  );
}
