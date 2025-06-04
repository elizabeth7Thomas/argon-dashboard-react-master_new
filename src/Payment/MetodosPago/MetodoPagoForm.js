//src/Payment/MetodosPago/MetodoPagoForm.js

import React, { useState } from "react";
import {
  Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button
} from "reactstrap";
import axios from "axios";

export default function MetodoPagoForm({
  isOpen, toggle, formData, setFormData, onSubmit, isEditing, idMetodo
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, Metodo: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const uri = isEditing
      ? `pagos/metodos/actualizar/${idMetodo}`
      : "pagos/metodos/crear";

    try {
      setLoading(true);
      await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri },
          request: {
            Metodo: formData.Metodo,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(isEditing ? "Método actualizado" : "Método creado");
      toggle();
      setFormData({ Metodo: "" });
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error al guardar el método:", error);
      alert("Error al guardar el método");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Método de Pago" : "Nuevo Método de Pago"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="metodo">Método</Label>
            <Input
              type="text"
              name="Metodo"
              id="Metodo"
              value={formData.Metodo || ""}
              onChange={handleChange}
              placeholder="Ej: Efectivo, Tarjeta"
            />
          </FormGroup>
          <Button color="primary" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
