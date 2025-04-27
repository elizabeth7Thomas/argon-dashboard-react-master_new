// components/Headers/HeaderTienda.js
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { 
  faBoxes, 
  faExchangeAlt, 
  faTruck, 
  faChartBar,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderTienda = () => {
  const navigate = useNavigate();
  
  return (
    <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center mb-4">
            <Col>
              <h2 className="text-white mb-0">
                <FontAwesomeIcon icon={faStore} className="mr-2" />
                Tienda de Conveniencia
              </h2>
            </Col>
          </Row>
          
          <Row>
            {/* Inventario */}
            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-card" 
                onClick={() => navigate("/admin/inventario")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Inventario
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">5,700</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fas fa-arrow-up" /> 12.5%
                        </span>
                        <span className="text-nowrap">Disponibles</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faBoxes} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Devoluciones */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0 hover-card">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Devoluciones
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">2,356</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                          <i className="fas fa-arrow-up" /> 3.48%
                        </span>
                        <span className="text-nowrap">Último mes</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Proveedores */}
            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-card" 
                onClick={() => navigate("/admin/proveedoresTienda")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Proveedores
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">24</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fas fa-arrow-up" /> 2.5%
                        </span>
                        <span className="text-nowrap">Activos</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faTruck} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Reportes */}
            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-card" 
                onClick={() => navigate("/admin/reportesTienda")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Ventas Hoy
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">$1,245</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fas fa-arrow-up" /> 8.7%
                        </span>
                        <span className="text-nowrap">vs. Ayer</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faChartBar} />
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

export default HeaderTienda;