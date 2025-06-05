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
    <div className="header bg-gradient-info pb-6 pt-5 ">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col>
              <h2 className="text-white mb-0">
               
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
                      <span className="h2 font-weight-bold mb-0"></span>
                      
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
                <Card 
                className="card-stats mb-4 mb-xl-0 hover-card" 
                onClick={() => navigate("/admin/tienda/preparados")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Preparados
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0"></span>
                    
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
                onClick={() => navigate("/admin/tienda/lotes")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Lotes 
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0"></span>
                     
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
                      <span className="h2 font-weight-bold mb-0"></span>
                   
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