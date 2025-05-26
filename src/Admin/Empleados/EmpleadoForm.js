import React, { useState, useEffect } from 'react';
import {
  ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';

export default function EmpleadoForm({ onSave, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    puesto: '',
    correo: '',
    telefono: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <ModalHeader toggle={onCancel}>
        {initialData ? "Editar Empleado" : "Nuevo Empleado"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Apellido</Label>
            <Input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Puesto</Label>
            <Input
              type="text"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Correo Electrónico</Label>
            <Input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Teléfono</Label>
            <Input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <ModalFooter>
            <Button color="secondary" onClick={onCancel}>Cancelar</Button>
            <Button color="success" type="submit">Guardar</Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </>
  );
}