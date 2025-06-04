// src/Admin/Empleados/EmpleadoForm.js
import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Row, Col, Spinner } from 'reactstrap';
import axios from 'axios';

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

  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const catalogoJornadas = JSON.parse(localStorage.getItem("catalogo_jornadas") || "[]");
  const catalogoAreas = JSON.parse(localStorage.getItem("catalogo_areas") || "[]");
  const catalogoRoles = JSON.parse(localStorage.getItem("catalogo_roles") || "[]");

  useEffect(() => {
    setAlert(null);
    setSuccess(null);
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
    const { name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneroChange = (value) => {
    setFormData(prev => ({
      ...prev,
      genero: value
    }));
  };

  // Valida el payload antes de enviarlo
  function validatePayload(payload) {
    try {
      // Intenta convertir a JSON string
      const jsonString = JSON.stringify(payload);
      // Intenta volver a parsear el string
      const parsed = JSON.parse(jsonString);
      // Busca valores vacíos o undefined
      const findInvalid = (obj, path = '') => {
        for (const key in obj) {
          const value = obj[key];
          const currentPath = path ? `${path}.${key}` : key;
          if (value === undefined) {
            console.warn(`⚠️ Valor undefined en: ${currentPath}`);
          }
          if (value === null) {
            console.warn(`⚠️ Valor null en: ${currentPath}`);
          }
          if (typeof value === 'string' && value.trim() === '') {
            console.warn(`⚠️ String vacío en: ${currentPath}`);
          }
          if (typeof value === 'object' && value !== null) {
            findInvalid(value, currentPath);
          }
        }
      };
      findInvalid(parsed);
      console.log("✅ Payload válido para enviar.");
      return true;
    } catch (err) {
      console.error("❌ Error al serializar el payload:", err);
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setSuccess(null);
    setLoading(true);
    const token = localStorage.getItem("token");

    // Detecta si es edición
    const isEdit = !!initialData && !!initialData.empleado?.id;
    const empleadoId = initialData?.empleado?.id;

    // Construye la URI según si es edición o creación
    const uri = isEdit
      ? `administracion/PUT/empleados/${empleadoId}`
      : "administracion/POST/empleados";

  // Construye el payload asegurando tipos correctos
  const payload = {
    metadata: { uri },
    request: {
      empleado: {
        dpi: String(formData.dpi).trim(),
        nombres: String(formData.nombres).trim(),
        apellidos: String(formData.apellidos).trim(),
        telefono: String(formData.telefono).trim(),
        direccion: String(formData.direccion || '').trim(),
        nit: String(formData.nit).trim(),
        genero: Boolean(formData.genero),
        id_jornada: Number(formData.id_jornada),
        email: String(formData.email).trim()
      },
      asignacion: {
        id_rol: Number(formData.id_rol),
        id_area: Number(formData.id_area),
        horas_semanales: Number(formData.horas_semanales)
      }
    }
  };

  // Validación estricta antes de enviar
  if (!validatePayload(payload)) {
    setAlert("El formato de los datos es inválido. Revisa los campos.");
    setLoading(false);
    return;
  }

  console.log("Payload enviado:", payload);
  console.log("Token enviado:", token);

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      // Imprime la respuesta completa del broker en consola
      console.log("Respuesta del broker:", response.data);

      const brokerResponse = response.data?.response?.data;
      if (brokerResponse && brokerResponse.message) {
        setSuccess(brokerResponse);
        setAlert(null);
      } else {
        setAlert("Empleado actualizado, pero no se recibió mensaje de confirmación.");
      }
      if (onSave) onSave(brokerResponse);
    } catch (error) {
      // Imprime el error completo del broker en consola si existe
      if (error.response) {
        console.log("Error del broker:", error.response.data);
        if (error.response.status === 404) {
          setAlert("Error 404: " + (error.response.data?.response?.data?.message || "El recurso no fue encontrado."));
        } else if (error.response.status === 500) {
          setAlert("Error 500: Error interno del servidor. Intenta más tarde o contacta al administrador.");
        } else {
          setAlert(
            error.response.data?.message ||
            error.response.data?.error ||
            `Error ${error.response.status}: ${error.response.statusText}`
          );
        }
      } else if (error.request) {
        setAlert("No hubo respuesta del servidor. Revisa tu conexión.");
      } else {
        setAlert(error.message || "Error desconocido.");
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {alert && <Alert color="danger">{alert}</Alert>}
      {success && (
        <Alert color="success">
          {success.message}
          {success.autenticacion && (
            <>
              <br />
              <strong>Usuario:</strong> {success.autenticacion.usuario}
              <br />
              <strong>Contraseña temporal:</strong> {success.autenticacion.contraseniaTemporal}
            </>
          )}
        </Alert>
      )}
      <FormGroup><Label>DPI</Label><Input name="dpi" value={formData.dpi} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Nombres</Label><Input name="nombres" value={formData.nombres} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Apellidos</Label><Input name="apellidos" value={formData.apellidos} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Teléfono</Label><Input name="telefono" value={formData.telefono} onChange={handleChange} required /></FormGroup>
      <FormGroup><Label>Dirección</Label><Input name="direccion" value={formData.direccion} onChange={handleChange} /></FormGroup>
      <FormGroup><Label>NIT</Label><Input name="nit" value={formData.nit} onChange={handleChange} required /></FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>
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
          {catalogoJornadas.map(j => (
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
          {catalogoAreas.map(a => (
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
          {catalogoRoles.map(r => (
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
      <Button type="submit" color="primary" className="mr-2" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Guardar"}
      </Button>
      <Button color="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
    </Form>
  );
}
