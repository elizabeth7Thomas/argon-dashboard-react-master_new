// src/Admin/Empleados/EmpleadoForm.js
import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import axios from 'axios';
import routes from '../routes';

export default function EmpleadoForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    dpi: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    nit: '',
    genero: true,
    id_jornada: '',
    email: '',
    id_area: '',
    id_rol: '',
    horas_semanales: 40
  });

  const [jornadas, setJornadas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Cargar jornadas, áreas y roles
    const fetchData = async () => {
      try {
        const [jRes, aRes, rRes] = await Promise.all([
          axios.get(routes.Administracion.Jornadas.GET_ALL),
          axios.get(routes.Administracion.Areas.GET_ALL),
          axios.get(routes.Administracion.Roles.GET_ALL)
        ]);
        setJornadas(jRes.data.jornadas || []);
        setAreas(aRes.data.areas || []);
        setRoles(rRes.data.roles || []);
      } catch (error) {
        setAlert("Error al cargar catálogos.");
      }
    };
    fetchData();
  }, []);

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
        id_jornada: initialData.empleado.id_jornada || '',
        email: initialData.empleado.email || '',
        id_area: initialData.asignacion.id_area || '',
        id_rol: initialData.asignacion.id_rol || '',
        horas_semanales: initialData.asignacion.horas_semanales || 40
      });
    } else {
      setFormData({
        dpi: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        direccion: '',
        nit: '',
        genero: true,
        id_jornada: '',
        email: '',
        id_area: '',
        id_rol: '',
        horas_semanales: 40
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? value === "true" : value
    }));
  };

  const handleGeneroChange = (value) => {
    setFormData(prev => ({
      ...prev,
      genero: value
    }));
  };

  const handleSubmit = async (e) => {
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
    try {
      await onSave(payload);
    } catch (error) {
      setAlert("Error al guardar empleado.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {alert && <Alert color="danger">{alert}</Alert>}
      <FormGroup><Label>DPI</Label><Input name="dpi" value={formData.dpi} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Nombres</Label><Input name="nombres" value={formData.nombres} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Apellidos</Label><Input name="apellidos" value={formData.apellidos} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Teléfono</Label><Input name="telefono" value={formData.telefono} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Dirección</Label><Input name="direccion" value={formData.direccion} onChange={handleChange} /></FormGroup>
      <FormGroup><Label>NIT</Label><Input name="nit" value={formData.nit} onChange={handleChange} required /></FormGroup>
      <FormGroup tag="fieldset">
        <Label>Género</Label>
        <Row>
          <Col>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="genero"
                  value={true}
                  checked={formData.genero === true}
                  onChange={() => handleGeneroChange(true)}
                />{" "}
                Masculino
              </Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="genero"
                  value={false}
                  checked={formData.genero === false}
                  onChange={() => handleGeneroChange(false)}
                />{" "}
                Femenino
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </FormGroup>
      <FormGroup><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleChange} required /></FormGroup>
      <FormGroup>
        <Label>Jornada</Label>
        <Input
          type="select"
          name="id_jornada"
          value={formData.id_jornada}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una jornada</option>
          {jornadas.map(j => (
            <option key={j.id} value={j.id}>{j.nombre}</option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Área</Label>
        <Input
          type="select"
          name="id_area"
          value={formData.id_area}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un área</option>
          {areas.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Rol</Label>
        <Input
          type="select"
          name="id_rol"
          value={formData.id_rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Horas semanales</Label>
        <Input
          name="horas_semanales"
          type="number"
          min="1"
          value={formData.horas_semanales}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <Button type="submit" color="primary" className="mr-2">Guardar</Button>
      <Button color="secondary" onClick={onCancel}>Cancelar</Button>
    </Form>
  );
}
