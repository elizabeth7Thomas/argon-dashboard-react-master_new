import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Container, Spinner, Alert, Button, Row, Col
} from 'reactstrap';
import HeaderTienda from 'components/Headers/HeaderTienda';
import LotesForm from './LotesForm'; // Ajusta la ruta si es distinta

const LotesList = () => {
  const [lotes, setLotes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const toggleModal = () => setModalAbierto(!modalAbierto);

  const obtenerLotes = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/GET/lotes/' },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLotes(response.data.response.data);
    } catch (error) {
      console.error('Error al obtener lotes:', error);
      setError('Error al cargar los lotes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerLotes();
  }, []);

  return (
    <>
      <HeaderTienda />
      <Container className="mt-4">
        <Row className="mb-3">
          <Col><h2>Lista de Lotes</h2></Col>
          <Col className="text-end">
            <Button color="primary" onClick={toggleModal}>Agregar Lote</Button>
          </Col>
        </Row>

        {cargando && (
          <div className="text-center">
            <Spinner color="primary" />
            <p>Cargando lotes...</p>
          </div>
        )}

        {error && <Alert color="danger">{error}</Alert>}

        {!cargando && !error && lotes.length === 0 && (
          <Alert color="info">No hay lotes registrados.</Alert>
        )}

        {!cargando && lotes.length > 0 && (
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Unidad</th>
                <th>Costo Unitario</th>
                <th>Precio Lote</th>
                <th>Stock</th>
                <th>Ingreso</th>
                <th>Vencimiento</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => (
                <tr key={lote.id}>
                  <td>{lote.id}</td>
                  <td>{lote.productos?.nombre || 'N/A'}</td>
                  <td>{lote.productos?.categoria?.nombre || 'N/A'}</td>
                  <td>{lote.productos?.unidades_medida?.abreviatura || 'N/A'}</td>
                  <td>Q{parseFloat(lote.costo_unitario).toFixed(2)}</td>
                  <td>Q{parseFloat(lote.precio_lote).toFixed(2)}</td>
                  <td>{lote.stock}</td>
                  <td>{new Date(lote.fecha_ingreso).toLocaleDateString()}</td>
                  <td>{new Date(lote.fecha_vencimiento).toLocaleDateString()}</td>
                  <td>{lote.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal para agregar lote */}
        <LotesForm
          abierto={modalAbierto}
          toggle={toggleModal}
          onSuccess={obtenerLotes}
        />
      </Container>
    </>
  );
};

export default LotesList;
