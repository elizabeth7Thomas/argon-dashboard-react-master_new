// components/Headers/Header.js
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { faGasPump, faPaintRoller, faTools, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h2 className="text-white mb-0">Panel de Control Principal</h2>
              </Col>
            </Row>
            
            {/* Card stats - Mejoradas con iconos e información relevante */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Combustibles
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">4/6</span>
                        <p className="mt-2 mb-0 text-muted text-sm">
                          <span className="text-success mr-2">
                            <i className="fa fa-arrow-up" /> 3.48%
                          </span>
                          <span className="text-nowrap">Bombas activas</span>
                        </p>
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Taller de Pintura
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">5</span>
                        <p className="mt-2 mb-0 text-muted text-sm">
                          <span className="text-success mr-2">
                            <i className="fa fa-arrow-up" /> 12.5%
                          </span>
                          <span className="text-nowrap">Vehículos hoy</span>
                        </p>
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Taller Mantenimiento
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">3</span>
                        <p className="mt-2 mb-0 text-muted text-sm">
                          <span className="text-danger mr-2">
                            <i className="fa fa-arrow-down" /> 5.2%
                          </span>
                          <span className="text-nowrap">Servicios pendientes</span>
                        </p>
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Tienda
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">$1,245</span>
                        <p className="mt-2 mb-0 text-muted text-sm">
                          <span className="text-success mr-2">
                            <i className="fa fa-arrow-up" /> 8.7%
                          </span>
                          <span className="text-nowrap">Ventas hoy</span>
                        </p>
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