// src/gasoline/Alerts/AlertForm.js
import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';

export default function AlertForm({
  isOpen, toggle, onSubmit,
  formData, setFormData, isEditing
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Alerta" : "Nueva Alerta"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="tipo">Tipo de Alerta</Label>
            <Input
              id="tipo"
              name="tipo"
              type="text"
              placeholder="Ej: Combustible Bajo"
              value={formData.tipo}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="mensaje">Mensaje</Label>
            <Input
              id="mensaje"
              name="mensaje"
              type="textarea"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Mensaje de alerta"
            />
          </FormGroup>

          <FormGroup>
            <Label for="nivel">Nivel</Label>
            <Input
              id="nivel"
              name="nivel"
              type="select"
              value={formData.nivel}
              onChange={handleChange}
            >
              <option value="critica">Crítica</option>
              <option value="advertencia">Advertencia</option>
              <option value="informativa">Informativa</option>
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
