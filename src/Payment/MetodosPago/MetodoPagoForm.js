// /payment/DashboardPagos/MetodosPago/MetodoPagoForm.js
import React from "react";
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button } from "reactstrap";

export default function MetodoPagoForm({ isOpen, toggle, formData, setFormData, onSubmit, isEditing }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Método de Pago" : "Nuevo Método de Pago"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="Metodo">Método</Label>
            <Input
              type="text"
              name="Metodo"
              id="Metodo"
              value={formData.Metodo || ""}
              onChange={handleChange}
              placeholder="Ej: Efectivo, Tarjeta"
            />
          </FormGroup>
          <Button color="primary" onClick={onSubmit}>
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
