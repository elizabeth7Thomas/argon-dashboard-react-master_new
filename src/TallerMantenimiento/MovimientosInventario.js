import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from "reactstrap";

const MovimientosInventario = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientoDetalle, setMovimientoDetalle] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleDetalle = () => setModalDetalle(!modalDetalle);
  const toggleError = () => setModalError(!modalError);

  const obtenerMovimientos = async () => {
    try {
      const resp = await axios.post("http://64.23.169.22:3761/broker/api/rest", {
        metadata: {
          uri: "tallerrepuestos/movimientos"
        },
        request: {}
      });
      setMovimientos(resp.data || []);
    } catch (err) {
      console.error("Error al obtener movimientos:", err);
      setErrorMsg("Error al obtener movimientos del inventario.");
      setModalError(true);
    }
  };

  const obtenerMovimientoPorId = async (id) => {
    try {
      const resp = await axios.post("http://64.23.169.22:3761/broker/api/rest", {
        metadata: {
          uri: `tallerrepuestos/movimientos/${id}`
        },
        request: {}
      });
      setMovimientoDetalle(resp.data);
      setModalDetalle(true);
    } catch (err) {
      console.error("Error al obtener detalle de movimiento:", err);
      setErrorMsg("Error al obtener el detalle del movimiento.");
      setModalError(true);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader>
              <h3 className="mb-0">Movimientos de Inventario</h3>
            </CardHeader>
            <CardBody>
              <Table responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.length > 0 ? movimientos.map((mov) => (
                    <tr key={mov.id}>
                      <td>{mov.id}</td>
                      <td>{mov.tipo}</td>
                      <td>{new Date(mov.fecha).toLocaleString()}</td>
                      <td>{mov.usuario}</td>
                      <td>
                        <Button size="sm" color="info" onClick={() => obtenerMovimientoPorId(mov.id)}>
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center">No hay movimientos registrados</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal Detalle */}
      <Modal isOpen={modalDetalle} toggle={toggleDetalle}>
        <ModalHeader toggle={toggleDetalle}>Detalle del Movimiento</ModalHeader>
        <ModalBody>
          {movimientoDetalle ? (
            <div>
              <p><strong>ID:</strong> {movimientoDetalle.id}</p>
              <p><strong>Tipo:</strong> {movimientoDetalle.tipo}</p>
              <p><strong>Fecha:</strong> {new Date(movimientoDetalle.fecha).toLocaleString()}</p>
              <p><strong>Usuario:</strong> {movimientoDetalle.usuario}</p>
              <p><strong>Detalle:</strong></p>
              <ul>
                {(movimientoDetalle.detalles || []).map((item, index) => (
                  <li key={index}>
                    Producto: {item.nombre_producto} - Cantidad: {item.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No se encontró información.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDetalle}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      {/* Modal Error */}
      <Modal isOpen={modalError} toggle={toggleError}>
        <ModalHeader toggle={toggleError}>Error</ModalHeader>
        <ModalBody>
          <Alert color="danger">{errorMsg}</Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleError}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MovimientosInventario;
