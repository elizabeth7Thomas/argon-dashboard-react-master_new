import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Container, Row, Col, Button } from "reactstrap";
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
  const [catalogoServicios, setCatalogoServicios] = useState([]);

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

    // Cargar catálogo de servicios desde localStorage
    const servicios = JSON.parse(localStorage.getItem("catalogo_servicios") || "[]");
    setCatalogoServicios(servicios);
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
        <Col md={6} className="d-flex justify-content-end align-items-center">
          <Input
            type="select"
            value={filtroServicio}
            onChange={(e) => setFiltroServicio(e.target.value)}
            style={{ maxWidth: "300px", marginRight: "10px" }}
          >
            <option value="">Todos los servicios</option>
            {catalogoServicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre}
              </option>
            ))}
          </Input>
          <Button color="primary" onClick={handleNuevaOrden}>
            Nueva Orden
          </Button>
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
