
// src/Payment/Devoluciones/DevolucionForm.js
import React, { useState } from 'react';
import {
  Button, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import axios from 'axios';

const DevolucionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    NoTransaccion: '',
    Monto: '',
    Descripcion: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: {
            uri: '/pagos/devoluciones/crear'
          },
          request: {
            ...formData
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const res = response.data;

      if (res.metadata._broker_status === 201) {
        setSuccessMsg('Devolución creada con éxito');
        setFormData({
          NoTransaccion: '',
          Monto: '',
          Descripcion: ''
        });

        if (onSuccess) onSuccess(res.response);
      } else {
        throw new Error(res.metadata._broker_message || 'Error desconocido');
      }

    } catch (err) {
      setErrorMsg(err.message || 'Error al crear la devolución');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
      {successMsg && <Alert color="success">{successMsg}</Alert>}

      <FormGroup>
        <Label for="NoTransaccion">No. Transacción</Label>
        <Input
          type="text"
          name="NoTransaccion"
          value={formData.NoTransaccion}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="Monto">Monto</Label>
        <Input
          type="number"
          name="Monto"
          value={formData.Monto}
          onChange={handleChange}
          step="0.01"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="Descripcion">Descripción</Label>
        <Input
          type="text"
          name="Descripcion"
          value={formData.Descripcion}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <Button color="primary" type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Devolución'}
      </Button>
    </Form>
  );
};

export default DevolucionForm;