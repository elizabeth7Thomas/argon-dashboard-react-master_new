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
    <div className="header bg-gradient-info pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          {/* Título y breadcrumb */}
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Sistema de Pagos</h2>
              <nav aria-label="breadcrumb">
               
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