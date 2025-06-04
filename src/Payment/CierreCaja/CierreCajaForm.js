import React, { useState } from 'react';
import axios from 'axios';

const CierreCajaForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    IdCaja: '',
    Servicio: '',
    CantidadFinal: '',
    Empleado: {
      IdEmpleado: '',
      NombreCompleto: '',
    },
    Retiro: 0,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('Empleado.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        Empleado: { ...prev.Empleado, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: '/pagos/cierre/crear' },
          request: form,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const status = response.data?.response?._broker_status;
      if (status === 201 || status === 200) {
        onSuccess();
        onClose();
      } else {
        setError(response.data?.response?._broker_message || 'Error al crear cierre');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al enviar el formulario.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Caja</label>
        <input
          type="number"
          name="IdCaja"
          className="form-control"
          value={form.IdCaja}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Servicio</label>
        <input
          type="number"
          name="Servicio"
          className="form-control"
          value={form.Servicio}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Cantidad Final</label>
        <input
          type="number"
          name="CantidadFinal"
          className="form-control"
          value={form.CantidadFinal}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Empleado ID</label>
        <input
          type="text"
          name="Empleado.IdEmpleado"
          className="form-control"
          value={form.Empleado.IdEmpleado}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Nombre Empleado</label>
        <input
          type="text"
          name="Empleado.NombreCompleto"
          className="form-control"
          value={form.Empleado.NombreCompleto}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <label>Retiro</label>
        <input
          type="number"
          name="Retiro"
          className="form-control"
          value={form.Retiro}
          onChange={handleChange}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
};

export default CierreCajaForm;
