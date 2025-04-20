// src/gasoline/Sales/HeaderSale.js
import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function HeaderSale() {
  return (
    <div className="header bg-gradient-primary pb-6 pt-5 pt-md-6">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6" xs="7">
              <h2 className="text-white mb-0">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Módulo de Ventas
              </h2>
            </Col>
          </Row>

          {/* Estadísticas rápidas dentro del header */}
          <Row>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 bg-gradient-primary text-white">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-white mb-0">Ventas Hoy</h5>
                      <span className="h2 font-weight-bold mb-0">12</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-white text-primary rounded-circle shadow">
                        <i className="fas fa-gas-pump" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 bg-gradient-success text-white">
                <CardBody>
                  <Row>
                    <div className="col">
                      <h5 className="text-uppercase text-white mb-0">Litros Vendidos</h5>
                      <span className="h2 font-weight-bold mb-0">2450 L</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-white text-success rounded-circle shadow">
                        <i className="fas fa-tachometer-alt" />
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
                      <h5 className="text-uppercase text-white mb-0">Total en Caja</h5>
                      <span className="h2 font-weight-bold mb-0">$13,500</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-white text-info rounded-circle shadow">
                        <i className="fas fa-dollar-sign" />
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
