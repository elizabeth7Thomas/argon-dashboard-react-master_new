import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGasPump,
  faDollarSign, 
  faUsers,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const HeaderIndex = () => {
  const [resumen, setResumen] = useState({
    ventasHoy: 0,
    bombasActivas: 0,
    clientesAtendidos: 0,
    serviciosCompletados: 0,
  });

  const API_URL = "http://64.23.169.22:3761/broker/api/rest";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        // Obtener clientes
        const clientesRes = await axios.post(
          API_URL,
          {
            metadata: { uri: "/pagos/cliente/obtener" },
            request: {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          
        );

        const clientes = clientesRes.data.response.clientes || [];

        // Obtener tipos de combustible
        const fuelRes = await axios.post(
          API_URL,
          {
            metadata: { uri: "/pagos/fuelType/list" },
            request: {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fuelTypes = fuelRes.data.response.fuelTypes || [];
        const bombasActivas = fuelTypes.filter(f => f.status).length;

        // Obtener transacciones de hoy
        const today = new Date();
        const fechaInicio = new Date(today);
        fechaInicio.setHours(0, 0, 0, 0);

        const fechaFinal = new Date(today);
        fechaFinal.setHours(23, 59, 59, 999);

        const transRes = await axios.post(
          API_URL,
          {
            metadata: { uri: "/pagos/transacciones/obtener" },
            request: {
              fechaInicio: fechaInicio.toISOString(),
              fechaFinal: fechaFinal.toISOString(),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transacciones = transRes.data.response.Transacciones || [];

        const ventasTotales = transacciones.reduce((acc, t) => acc + parseFloat(t.Total || 0), 0);
        const servicios = transacciones.filter(t => t.ServiciosTransaccion).length;

        setResumen({
          ventasHoy: ventasTotales.toLocaleString("es-GT", {
            style: "currency",
            currency: "GTQ",
          }),
          bombasActivas,
          clientesAtendidos: clientes.length,
          serviciosCompletados: servicios,
        });
      } catch (error) {
        console.error("Error al cargar el resumen:", error);
      }
    };

    fetchResumen();
  }, []);

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-7">
      <Container fluid>
        <div className="header-body">
          <Row>
            <Col lg="3" md="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0 shadow">
                <CardBody>
                  <Row>
                    <Col>
                      <h5 className="card-title text-uppercase text-muted mb-0">Ventas Hoy</h5>
                      <span className="h2 font-weight-bold mb-0">{resumen.ventasHoy}</span>
                    </Col>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faDollarSign} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" md="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0 shadow">
                <CardBody>
                  <Row>
                    <Col>
                      <h5 className="card-title text-uppercase text-muted mb-0">Bombas Activas</h5>
                      <span className="h2 font-weight-bold mb-0">{resumen.bombasActivas}</span>
                    </Col>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faGasPump} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" md="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0 shadow">
                <CardBody>
                  <Row>
                    <Col>
                      <h5 className="card-title text-uppercase text-muted mb-0">Clientes Atendidos</h5>
                      <span className="h2 font-weight-bold mb-0">{resumen.clientesAtendidos}</span>
                    </Col>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3" md="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0 shadow">
                <CardBody>
                  <Row>
                    <Col>
                      <h5 className="card-title text-uppercase text-muted mb-0">Servicios Hoy</h5>
                      <span className="h2 font-weight-bold mb-0">{resumen.serviciosCompletados}</span>
                    </Col>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faCheckCircle} />
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

export default HeaderIndex;
