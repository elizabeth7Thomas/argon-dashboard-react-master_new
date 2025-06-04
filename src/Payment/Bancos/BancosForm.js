//src/Payment/Bancos/BancosForm.js
import React from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from "reactstrap";
import axios from "axios";

export default function BancoForm({
  isOpen,
  toggle,
  formData,
  setFormData,
  onSuccess,
  isEditing,
  idBanco
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = {
        metadata: {
          uri: isEditing ? `pagos/bancos/actualizar/${idBanco}` : "pagos/bancos/crear",
        },
        request: formData,
      };

      await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onSuccess(); // Recarga la lista
      toggle();    // Cierra modal
    } catch (error) {
      console.error("Error al guardar el banco:", error);
      alert("Hubo un error al guardar el banco");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Banco" : "Nuevo Banco"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="nombre">Nombre del Banco</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              placeholder="Nombre del banco"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="estado">Estado</Label>
            <Input
              id="estado"
              name="estado"
              type="select"
              value={formData.estado ?? ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </Input>
          </FormGroup>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancelar</Button>
            <Button color="success" type="submit">
              {isEditing ? "Guardar Cambios" : "Guardar"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
}
