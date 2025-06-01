// components/Headers/Header.js
import React from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { faGasPump, faPaintRoller, faTools, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-6 pt-5">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h2 className="text-white mb-0">Panel de Control Principal</h2>
              </Col>
            </Row>
            
            {/* Card stats - Mejoradas con iconos e información relevante */}
            <Row>
              <Col xl="3" md="6">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Combustibles
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">4/6</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faGasPump} />
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
                          Taller Pintura
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">5</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faPaintRoller} />
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
                          Taller Manten.
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">3</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faTools} />
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
                          Tienda
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">$1,245</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faStore} />
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
    </>
  );
};

export default Header;