// src/Admin/Roles/RolForm.js

import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';
import axios from "axios";

export default function RolForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    salario: '',
    id_rol_superior: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar catálogo de roles desde localStorage
  const catalogoRoles = JSON.parse(localStorage.getItem("catalogo_roles") || "[]");

  useEffect(() => {
    setAlert(null);
    setSuccess(null);
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        salario: initialData.salario || '',
        id_rol_superior: initialData.id_rol_superior || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        salario: '',
        id_rol_superior: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    const isEdit = !!initialData && !!initialData.id;
    const rolId = initialData?.id;

    const uri = isEdit
      ? `administracion/PUT/roles/${rolId}`
      : "administracion/POST/roles";

    // Construir el request, id_rol_superior solo si tiene valor
    const request = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      salario: parseFloat(formData.salario),
    };
    if (formData.id_rol_superior !== "" && !isNaN(Number(formData.id_rol_superior))) {
      request.id_rol_superior = Number(formData.id_rol_superior);
    }

    const payload = {
      metadata: { uri },
      request
    };

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
      const brokerResponse = response.data?.response?.data;
      if (brokerResponse && brokerResponse.message) {
        setSuccess(brokerResponse.message);
        setAlert(null);
        if (onSave) onSave(brokerResponse);
      } else {
        setAlert("Rol guardado, pero no se recibió mensaje de confirmación.");
      }
    } catch (error) {
      let brokerMsg = "";
      let brokerStatus = "";
      let brokerError = "";
      let brokerPath = "";
      let brokerTimestamp = "";
      if (error.response) {
        const resp = error.response.data?.response;
        brokerMsg = resp?._broker_message;
        brokerStatus = resp?._broker_status;
        brokerError = resp?.data?.error;
        brokerPath = resp?.data?.path;
        brokerTimestamp = resp?.data?.timestamp;
        setAlert(
          <div style={{ color: "#fff" }}>
            <strong>Error del broker:</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
            {brokerStatus && (
              <>
                <br />
                <span>Código: {brokerStatus}</span>
              </>
            )}
            {brokerError && (
              <>
                <br />
                <span>Detalle: {brokerError}</span>
              </>
            )}
            {brokerPath && (
              <>
                <br />
                <span>Ruta: {brokerPath}</span>
              </>
            )}
            {brokerTimestamp && (
              <>
                <br />
                <span>Fecha: {brokerTimestamp}</span>
              </>
            )}
          </div>
        );
      } else if (error.request) {
        setAlert(<span style={{ color: "#fff" }}>No hubo respuesta del servidor. Revisa tu conexión.</span>);
      } else {
        setAlert(<span style={{ color: "#fff" }}>{error.message || "Error desconocido."}</span>);
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {alert && <Alert color="danger">{alert}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <FormGroup>
        <Label>Nombre</Label>
        <Input name="nombre" value={formData.nombre} onChange={handleChange} required disabled={loading} />
      </FormGroup>
      <FormGroup>
        <Label>Descripción</Label>
        <Input name="descripcion" value={formData.descripcion} onChange={handleChange} required disabled={loading} />
      </FormGroup>
      <FormGroup>
        <Label>Salario</Label>
        <Input name="salario" type="number" step="0.01" value={formData.salario} onChange={handleChange} required disabled={loading} />
      </FormGroup>
      <FormGroup>
        <Label>Rol Superior (opcional)</Label>
        <Input
          name="id_rol_superior"
          type="select"
          value={formData.id_rol_superior}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Sin superior</option>
          {catalogoRoles
            .filter(r => !initialData || r.id !== initialData.id) // Evita seleccionarse a sí mismo
            .map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
        </Input>
      </FormGroup>
      <Button color="primary" type="submit" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Guardar"}
      </Button>{' '}
      <Button color="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
    </Form>
  );
}
