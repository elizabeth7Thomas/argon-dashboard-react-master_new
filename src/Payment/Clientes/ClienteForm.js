//src/Payment/Clientes/ClienteForm.js

import React from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from "reactstrap";
import axios from "axios";

export default function ClienteForm({
  isOpen,
  toggle,
  formData,
  setFormData,
  onSuccess,
  isEditing,
  idCliente
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      metadata: {
        uri: isEditing
          ? `pagos/cliente/actualizar/${idCliente}`
          : "pagos/cliente/crear",
      },
       request: isEditing
    ? {
        NombreCliente: formData.nombreCliente,
        ApellidosCliente: formData.apellidosCliente,
        Direccion: formData.direccion,
        Telefono: formData.telefono,
        Email: formData.email,
      }
    : {
        NombreCliente: formData.nombreCliente,
        ApellidosCliente: formData.apellidosCliente,
        Nit: formData.nit,
        Direccion: formData.direccion,
        Telefono: formData.telefono,
        Email: formData.email,
        Dpi: formData.dpi,
      },
};

    try {
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

      onSuccess();
      toggle();
    } catch (error) {
      const mensaje = error?.response?.data?.mensaje || "Error al guardar el cliente";
      alert(mensaje);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {[
            ["nombreCliente", "Nombre"],
            ["apellidosCliente", "Apellidos"],
            ["nit", "NIT"],
            ["direccion", "Dirección"],
            ["telefono", "Teléfono"],
            ["email", "Email"],
            ["dpi", "DPI"],
          ].map(([field, label]) => (
            <FormGroup key={field}>
              <Label for={field}>{label}</Label>
              <Input
                id={field}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                required
              />
            </FormGroup>
          ))}
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
