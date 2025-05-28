// src/Admin/Empleados/EmpleadoForm.js
import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function EmpleadoForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    dpi: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    nit: '',
    genero: true,
    id_jornada: 1,
    email: '',
    id_area: '',
    id_rol: '',
    horas_semanales: 40
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dpi: initialData.empleado.dpi || '',
        nombres: initialData.empleado.nombres || '',
        apellidos: initialData.empleado.apellidos || '',
        telefono: initialData.empleado.telefono || '',
        direccion: initialData.empleado.direccion || '',
        nit: initialData.empleado.nit || '',
        genero: initialData.empleado.genero ?? true,
        id_jornada: initialData.empleado.id_jornada || 1,
        email: initialData.empleado.email || '',
        id_area: initialData.asignacion.id_area || '',
        id_rol: initialData.asignacion.id_rol || '',
        horas_semanales: initialData.asignacion.horas_semanales || 40
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
    const payload = {
      empleado: {
        dpi: formData.dpi,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        direccion: formData.direccion,
        nit: formData.nit,
        genero: formData.genero,
        id_jornada: parseInt(formData.id_jornada),
        email: formData.email
      },
      asignacion: {
        id_area: formData.id_area,
        id_rol: formData.id_rol,
        horas_semanales: parseInt(formData.horas_semanales)
      }
    };

    onSave(payload);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup><Label>DPI</Label><Input name="dpi" value={formData.dpi} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Nombres</Label><Input name="nombres" value={formData.nombres} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Apellidos</Label><Input name="apellidos" value={formData.apellidos} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Teléfono</Label><Input name="telefono" value={formData.telefono} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Dirección</Label><Input name="direccion" value={formData.direccion} onChange={handleChange} /></FormGroup>
      <FormGroup><Label>NIT</Label><Input name="nit" value={formData.nit} onChange={handleChange} required /></FormGroup>
      <FormGroup check><Label check><Input type="checkbox" name="genero" checked={formData.genero} onChange={handleChange} /> Masculino</Label></FormGroup>
      <FormGroup><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>ID Jornada</Label><Input name="id_jornada" type="number" value={formData.id_jornada} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>ID Área</Label><Input name="id_area" value={formData.id_area} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>ID Rol</Label><Input name="id_rol" value={formData.id_rol} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Horas semanales</Label><Input name="horas_semanales" type="number" value={formData.horas_semanales} onChange={handleChange} required /></FormGroup>
      
      <Button type="submit" color="success" className="mr-2">Guardar</Button>
      <Button color="secondary" onClick={onCancel}>Cancelar</Button>
    </Form>
  );
}
