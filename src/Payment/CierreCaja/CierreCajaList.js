// src/CierreCaja/CierreCajaList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Alert } from 'reactstrap';

const CierreCajaList = ({ onSelect, reload }) => {
  const [cierres, setCierres] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [error, setError] = useState(null);

  const fetchCierres = async () => {
    try {
      setError(null);
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: '/pagos/cierre/obtener' },
          request: {
            fechaInicio: fechaInicio || '',
            fechaFinal: fechaFinal || '',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data?.response?.data?.cierre;
      setCierres(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener cierres:', error);
      setError("Hubo un problema al obtener los datos.");
    }
  };

  useEffect(() => {
    fetchCierres();
  }, [reload]);

  return (
    <div className="mt-4">
      <h4>Listado de Cierres</h4>
      <div className="d-flex gap-2 mb-3">
        <Input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <Input
          type="date"
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
        />
        <Button color="primary" onClick={fetchCierres}>
          Buscar
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setFechaInicio('');
            setFechaFinal('');
            fetchCierres();
          }}
        >
          Cargar Todos
        </Button>
      </div>
      {error && <Alert color="danger">{error}</Alert>}
      <Table responsive hover className="mt-4">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Caja</th>
            <th>Servicio</th>
            <th>Total Día</th>
            <th>Empleado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cierres.map((cierre) => (
            <tr key={cierre.Id}>
              <td>{new Date(cierre.Fecha).toLocaleDateString()}</td>
              <td>{cierre.IdCaja}</td>
              <td>{cierre.Servicio}</td>
              <td>{cierre.TotalDia}</td>
              <td>{cierre.Empleado?.NombreCompleto || 'N/D'}</td>
              <td>
                <Button
                  size="sm"
                  color="info"
                  onClick={() => onSelect(cierre)}
                >
                  Ver
                </Button>
              </td>
            </tr>
          ))}
          {cierres.length === 0 && (
            <tr>
              <td colSpan="6">No hay cierres para mostrar.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CierreCajaList;
