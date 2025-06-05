// src/components/Headers/HeaderAdministracion.js
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { faUsers, faBell, faSitemap, faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const HeaderAdministracion = () => {
  const [empleadosCount, setEmpleadosCount] = useState(0);
  const [alertasCount, setAlertasCount] = useState(0);
  const [areasCount, setAreasCount] = useState(0);
  const [proveedoresCount, setProveedoresCount] = useState(0); // Cambiado a proveedores

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // Empleados
    axios.post(
      "http://64.23.169.22:3761/broker/api/rest",
      { metadata: { uri: "administracion/GET/empleados" }, request: {} },
      { headers }
    ).then(res => {
      const empleados = res.data?.response?.data?.empleados || [];
      setEmpleadosCount(empleados.length);
    }).catch(() => setEmpleadosCount(0));

    // Alertas
    axios.post(
      "http://64.23.169.22:3761/broker/api/rest",
      { metadata: { uri: "administracion/GET/alertas" }, request: {} },
      { headers }
    ).then(res => {
      const alertas = res.data?.response?.data?.alertas || [];
      setAlertasCount(alertas.length);
    }).catch(() => setAlertasCount(0));

    // Áreas
    axios.post(
      "http://64.23.169.22:3761/broker/api/rest",
      { metadata: { uri: "administracion/GET/areas" }, request: {} },
      { headers }
    ).then(res => {
      const areas = res.data?.response?.data?.areas || [];
      setAreasCount(areas.length);
    }).catch(() => setAreasCount(0));

    // Proveedores (antes movimientos)
    axios.post(
      "http://64.23.169.22:3761/broker/api/rest",
      { metadata: { uri: "administracion/GET/proveedores" }, request: {} },
      { headers }
    ).then(res => {
      const proveedores = res.data?.response?.data?.proveedores || [];
      setProveedoresCount(proveedores.length);
    }).catch(() => setProveedoresCount(0));
  }, []);

  return (
    <div className="header bg-gradient-info pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          {/* Título y breadcrumb */}
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Panel de Administración</h2>
            </Col>
          </Row>

          {/* Tarjetas de métricas */}
          <Row>
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Empleados
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{empleadosCount}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Alertas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{alertasCount}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faBell} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Áreas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{areasCount}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faSitemap} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Proveedores
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{proveedoresCount}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faTruck} />
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

export default HeaderAdministracion;