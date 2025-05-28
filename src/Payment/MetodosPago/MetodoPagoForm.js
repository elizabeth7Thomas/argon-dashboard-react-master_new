// /payment/DashboardPagos/MetodosPago/MetodoPagoForm.js
import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";

export default function MetodoPagoForm({
  isOpen,
  toggle,
  formData,
  setFormData,
  onSubmit,
  isEditing,
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3001/pagos/metodos/crear",
        { metodo: formData.metodo }
      );

      alert(response.data.mensaje || "Método creado exitosamente");
      toggle(); // cerrar el modal
      setFormData({ metodo: "" }); // limpiar formulario
      if (onSubmit) onSubmit(); // opcional: notificar al padre
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data || "Ocurrió un error al crear el método de pago"
      );
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
              name="metodo"
              id="metodo"
              value={formData.metodo || ""}
              onChange={handleChange}
              placeholder="Ej: Efectivo, Tarjeta"
            />
          </FormGroup>
          <Button color="primary" onClick={handleSave} disabled={loading}>
            {loading
              ? "Guardando..."
              : isEditing
              ? "Actualizar"
              : "Crear"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
