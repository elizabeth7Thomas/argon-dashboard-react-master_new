import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function Header_alerta() {
  return (
    <div className="header bg-gradient-danger pb-6 pt-5 pt-md-6">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6" xs="7">
              <h2 className="text-white mb-0">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                Módulo de Alertas
              </h2>
            </Col>
          </Row>

          {/* Estadísticas rápidas dentro del header */}
          <Row>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 bg-gradient-danger text-white">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-white mb-0">Críticas</h5>
                      <span className="h2 font-weight-bold mb-0">3</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-white text-danger rounded-circle shadow">
                        <i className="fas fa-skull-crossbones" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 bg-gradient-warning text-white">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-white mb-0">Advertencias</h5>
                      <span className="h2 font-weight-bold mb-0">5</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-white text-warning rounded-circle shadow">
                        <i className="fas fa-exclamation" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 bg-gradient-info text-white">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-white mb-0">Informativas</h5>
                      <span className="h2 font-weight-bold mb-0">7</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-white text-info rounded-circle shadow">
                        <i className="fas fa-info-circle" />
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
}
