// src/components/Headers/HeaderAdministracion.js
import React from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { 
  faUsers, 
  faBell, 
  faSitemap, 
   
  faTruck, 
  
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderAdministracion = () => {
  return (
    <div className="header bg-gradient-success pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          {/* Título y breadcrumb */}
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Panel de Administración</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-dark">
                  <li className="breadcrumb-item active" aria-current="page">
                    Administración
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
                        Empleados
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">42</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fa fa-arrow-up"></i> 3.48%
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
                        Alertas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">5</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faBell} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      <i className="fas fa-arrow-down"></i> 1.10%
                    </span>
                    <span className="text-nowrap">Desde ayer</span>
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
                        Áreas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">8</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faSitemap} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up"></i> 12%
                    </span>
                    <span className="text-nowrap">Desde último trimestre</span>
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
                        Proveedores
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">15</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faTruck} />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up"></i> 5.3%
                    </span>
                    <span className="text-nowrap">Desde último año</span>
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

export default HeaderAdministracion;