import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'reactstrap';
import HeaderTienda from 'components/Headers/HeaderTienda';

const ReportesTienda = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const obtenerVentas = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/GET/ventas/' },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setVentas(response.data.response.data);
      console.log('Ventas:', response.data.response.data);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      setError('Hubo un error al cargar las ventas.');
    } finally {
      setCargando(false); // 
    }
  };

  obtenerVentas();
}, []);


  return (
    <>
    <HeaderTienda />
    <Container className="mt-4">
      
      
      
      <h2>Reporte de Ventas</h2>
      {cargando && <Spinner color="primary">Cargando...</Spinner>}
      {error && <Alert color="danger">{error}</Alert>}
      {!cargando && !error && ventas.length === 0 && (
        <Alert color="info">No hay ventas registradas.</Alert>
      )}
      {!cargando && ventas.length > 0 && (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>NIT</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                <td>{venta.nombre}</td>
                <td>{venta.nit}</td>
                <td>Q{parseFloat(venta.total).toFixed(2)}</td>
                <td>{venta.estado_venta}</td>
                <td>{venta.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
    </>
  );
};

export default ReportesTienda;