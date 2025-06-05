import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "reactstrap";
import OrdenList from "../Ordenes/OrdenList";
import OrdenForm from "../Ordenes/OrdenForm";
import routes from "../routes";

const PageOrdenesAdmin = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [estadosDetalles, setEstadosDetalles] = useState([]);


  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await axios.get(routes.Administracion.Ordenes.GET_ALL);
        const ordenesBase = res.data.ordenes;

        const ordenesCompletas = await Promise.all(
          ordenesBase.map(async (orden) => {
            const resDetalle = await axios.get(
              routes.Administracion.Ordenes.GET_BY_ID(orden.id)
            );
            return resDetalle.data.orden;
          })
        );

        setOrdenes(ordenesCompletas);
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
      }
    };

    const fetchEstadosDetalles = async () => {
      try {
        const res = await axios.get(routes.Administracion.Ordenes.GET_ESTADOS_ORDENES_DETALLES);
        setEstadosDetalles(res.data.estados_ordenes_detalles);
      } catch (error) {
        console.error("Error al obtener los estados de los detalles:", error);
      }
    };

    fetchOrdenes();
    fetchEstadosDetalles();
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleVerDetalles = (orden) => {
    setOrdenSeleccionada(orden);
    setModalOpen(true);
  };

  const handleNuevaOrden = () => {
    setOrdenSeleccionada(null);
    setModalOpen(true);
  };


  return (
    <Container>
      <h2>Gestión de Órdenes</h2>

      <Row className="mb-3">
        <Col md={12} className="d-flex justify-content-end align-items-center">
          <Button color="primary" onClick={handleNuevaOrden}>
            Nueva Orden
          </Button>
        </Col>
      </Row>

      <OrdenList ordenes={ordenes} onVerDetalles={handleVerDetalles} />

      <OrdenForm
        orden={ordenSeleccionada}
        estadosDetalles={estadosDetalles}
        isOpen={modalOpen}
        toggle={toggleModal}
      />
    </Container>
  );
};

export default PageOrdenesAdmin;
