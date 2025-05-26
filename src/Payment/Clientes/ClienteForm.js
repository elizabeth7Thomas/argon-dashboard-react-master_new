import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";

export default function ClienteForm({ isOpen, toggle, formData, setFormData, onSuccess, isEditing, idCliente }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        
        await axios.put(`http://localhost:3001/pagos/cliente/actualizar/${idCliente}`, formData);
      } else {
        
        await axios.post("http://localhost:3001/pagos/cliente/crear", formData);
      }

      onSuccess();
      toggle();
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      alert("Cliente guardado exitosamente.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="NombreCliente">Nombre</Label>
            <Input
              id="NombreCliente"
              name="NombreCliente"
              value={formData.NombreCliente || ""}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="ApellidosCliente">Apellidos</Label>
            <Input
              id="ApellidosCliente"
              name="ApellidosCliente"
              value={formData.ApellidosCliente || ""}
              onChange={handleChange}
              placeholder="Apellidos"
              required
            />
          </FormGroup>
          {!isEditing && (
            <>
              <FormGroup>
                <Label for="Nit">NIT</Label>
                <Input
                  id="Nit"
                  name="Nit"
                  value={formData.Nit || ""}
                  onChange={handleChange}
                  placeholder="1234567-8"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="Dpi">DPI</Label>
                <Input
                  id="Dpi"
                  name="Dpi"
                  value={formData.Dpi || ""}
                  onChange={handleChange}
                  placeholder="1234567890101"
                  required
                />
              </FormGroup>
            </>
          )}
          <FormGroup>
            <Label for="Direccion">Dirección</Label>
            <Input
              id="Direccion"
              name="Direccion"
              value={formData.Direccion || ""}
              onChange={handleChange}
              placeholder="Dirección del cliente"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="Telefono">Teléfono</Label>
            <Input
              id="Telefono"
              name="Telefono"
              value={formData.Telefono || ""}
              onChange={handleChange}
              placeholder="+502 1234 5678"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="Email">Email</Label>
            <Input
              id="Email"
              name="Email"
              type="email"
              value={formData.Email || ""}
              onChange={handleChange}
              placeholder="cliente@ejemplo.com"
              required
            />
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
