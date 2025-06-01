import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Container, Row, Col } from "reactstrap";
import OrdenList from "../Ordenes/OrdenList";
import OrdenForm from "../Ordenes/OrdenForm";
import routes from "../routes";

const PageOrdenesAdmin = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [estadosDetalles, setEstadosDetalles] = useState([]);
  const [filtroServicio, setFiltroServicio] = useState("");
  const [busqueda, setBusqueda] = useState("");

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

  const ordenesFiltradas = ordenes
    .filter((o) =>
      filtroServicio ? o.servicio?.id.toString() === filtroServicio : true
    )
    .filter((o) =>
      busqueda ? o.id.toString().includes(busqueda.toLowerCase()) : true
    );

  return (
    <Container>
      <h2>Gestión de Órdenes</h2>

      <Row className="mb-3">
        <Col md={6}>
          <Input
            type="text"
            placeholder="Buscar por ID"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Input
            type="select"
            onChange={(e) => setFiltroServicio(e.target.value)}
          >
            <option value="">Todos los servicios</option>
            {ordenes.map((o) => o.servicio).filter((s, index, self) =>
              s && self.findIndex(s2 => s2.id === s.id) === index
            ).map((servicio) => (
              <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
            ))}
          </Input>
        </Col>
      </Row>

      <OrdenList ordenes={ordenesFiltradas} onVerDetalles={handleVerDetalles} />

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
