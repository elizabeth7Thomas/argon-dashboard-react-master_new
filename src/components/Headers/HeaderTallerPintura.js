import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle
} from "reactstrap";

const HeaderTallerPintura = () => {
  const [stats, setStats] = useState({
    servicios: 0,
    tiposServicios: 0,
    tiposVehiculos: 0,
  });

  const token = localStorage.getItem("token");

  const fetchData = useCallback(async (uri) => {
    const payload = {
      metadata: { uri },
      request: {},
    };

    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(`Error al obtener datos de ${uri}`);
        return [];
      }

      const data = await res.json();
      return data.response || [];
    } catch (error) {
      console.error(`Error de red al obtener datos de ${uri}:`, error);
      return [];
    }
  }, [token]);

  useEffect(() => {
    const cargarStats = async () => {
      const [servicios, tiposServicios, tiposVehiculos] = await Promise.all([
        fetchData("/pintura/GET/servicios"),
        fetchData("/pintura/GET/tiposervicios"),
        fetchData("/pintura/GET/tiposvehiculos"),
      ]);

      setStats({
        servicios: servicios.length,
        tiposServicios: tiposServicios.length,
        tiposVehiculos: tiposVehiculos.length,
      });
    };

    cargarStats();
  }, [fetchData]);

  return (
    <div className="header bg-gradient-info pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Taller de Pintura</h2>
            </Col>
          </Row>

          <Row>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Servicios disponibles
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.servicios}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-tools" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Tipos de servicio
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.tiposServicios}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-paint-roller" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Tipos de vehículo
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.tiposVehiculos}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-car-side" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HeaderTallerPintura;
