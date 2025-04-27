import React from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { 
  faMoneyBillWave,
  faCreditCard,
  faExchangeAlt,
  faCashRegister
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderPagos = ({ stats = {} }) => {
  return (
    <div className="header bg-gradient-primary pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          {/* Título y breadcrumb */}
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Sistema de Pagos</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-dark bg-transparent mb-0">
                  <li className="breadcrumb-item">
                    <a href="#/">Inicio</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Pagos
                  </li>
                </ol>
              </nav>
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
                        Transacciones
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.transacciones || 0}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fa fa-arrow-up"></i> 12.5%
                    </span>
                    <span className="text-nowrap">Últimas 24h</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Facturación
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">${(stats.facturas * 150).toLocaleString()}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up"></i> 8.3%
                    </span>
                    <span className="text-nowrap">Este mes</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Métodos de Pago
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.metodos || 0}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faCreditCard} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up"></i> 2.1%
                    </span>
                    <span className="text-nowrap">Desde último mes</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            
            <Col xl="3" md="6">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Cierres de Caja
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.cierres || 0}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faCashRegister} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      <i className="fas fa-arrow-down"></i> 1.5%
                    </span>
                    <span className="text-nowrap">Última semana</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HeaderPagos;