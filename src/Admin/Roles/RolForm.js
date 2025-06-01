// src/Admin/Roles/RolForm.js

import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

export default function RolForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    salario: '',
    id_rol_superior: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        salario: initialData.salario || '',
        id_rol_superior: initialData.id_rol_superior || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      salario: parseFloat(formData.salario),
      id_rol_superior: parseInt(formData.id_rol_superior),
    };
    onSave(data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Nombre</Label>
        <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Label>Descripción</Label>
        <Input name="descripcion" value={formData.descripcion} onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Label>Salario</Label>
        <Input name="salario" type="number" step="0.01" value={formData.salario} onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Label>ID Rol Superior</Label>
        <Input name="id_rol_superior" type="number" value={formData.id_rol_superior} onChange={handleChange} required />
      </FormGroup>
      <Button color="primary" type="submit">Guardar</Button>{''}
      <Button color="secondary" onClick={onCancel}>Cancelar</Button>
    </Form>
  );
}
