// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";

const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const HeaderMantenimiento = () => {
  const navigate = useNavigate();


  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [tiposServiciosCount, setTiposServiciosCount] = useState(0);
  const [precioHistorialCount, setPrecioHistorialCount] = useState(0);

  useEffect(() => {
    // Clientes
    axios.get(`${BASE_URL}/clientes`)
      .then((res) => setClientesCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setClientesCount(0));
    // Productos
    axios.get(`${BASE_URL}/productos`)
      .then((res) => setProductosCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setProductosCount(0));
    // Tipos de servicios
    axios.get(`${BASE_URL}/tiposervicios`)
      .then((res) => setTiposServiciosCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setTiposServiciosCount(0));
    // Precio Historial
    axios.get(`${BASE_URL}/preciohistorial`)
      .then((res) => setPrecioHistorialCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setPrecioHistorialCount(0));
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-6 pt-5">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h2 className="text-white mb-0">Taller de Mantenimiento</h2>
              </Col>
            </Row>

            <Row>
              <Col lg="3" md="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 hover-scale"
                onClick={() => navigate("/admin/mantenimiento/clientes")}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Clientes
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {clientesCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="ni ni-single-02" /> {/* Icono de clientes */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="3" md="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 hover-scale" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/mantenimiento/productos")}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Productos
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {productosCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="ni ni-box-2" /> {/* Icono de productos */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="3" md="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 hover-scale" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/mantenimiento/tiposServicios")}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Tipos de servicios
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {tiposServiciosCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="ni ni-settings" /> {/* Icono de servicios */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="3" md="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 hover-scale" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/mantenimiento/precioHistorial")}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Precio Historial
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {precioHistorialCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="ni ni-money-coins" /> {/* Icono de precios */}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
        <style jsx>{`
        .hover-scale {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-scale:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .bg-gradient-orange {
          background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
        }
      `}</style>
      </div>
    </>
  );
};

export default HeaderMantenimiento;
