import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Alert } from 'reactstrap';

const CierreCajaList = ({ onSelect, reload }) => {
  // Definir todos los estados necesarios
  const [cierres, setCierres] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCierres = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'pagos/cierre/obtener' },
          request: {
            fechaInicio: fechaInicio || undefined,
            fechaFinal: fechaFinal || undefined,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data?.response?.data?.cierre || [];
      setCierres(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener cierres:', error);
      setError(error.response?.data?.response?._broker_message || 
              "Hubo un problema al obtener los datos.");
    } finally {
      setLoading(false);
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
        <Button color="primary" onClick={fetchCierres} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setFechaInicio('');
            setFechaFinal('');
            fetchCierres();
          }}
          disabled={loading}
        >
          Limpiar
        </Button>
      </div>

      {error && <Alert color="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-4">Cargando cierres...</div>
      ) : (
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
            {cierres.length > 0 ? (
              cierres.map((cierre) => (
                <tr key={cierre.Id}>
                  <td>{new Date(cierre.Fecha).toLocaleDateString()}</td>
                  <td>{cierre.IdCaja}</td>
                  <td>{cierre.Servicio}</td>
                  <td>Q{cierre.TotalDia?.toFixed(2)}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {error ? 'Error al cargar datos' : 'No hay cierres para mostrar'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CierreCajaList;