import {  Container, Row,Col,Card,CardBody,CardTitle} from "reactstrap";
import { useNavigate } from "react-router-dom";

const HeaderTallerPintura = () => {
    const navigate = useNavigate();
  return (
    <>
    
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              
            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/servicios")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Servicios
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">350</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-tools" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Servicios disponibles</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/devoluciones")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Devoluciones
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">350</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-undo" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Devoluciones</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/tipos-pintura")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Tipos de pinturas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">350</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                        <i className="fas fa-paint-roller" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Tipos de pinturas</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/tipos-servicios")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Tipos de servicios
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">87</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-cogs" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Tipos de servicios</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/inventarios")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Inventario
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">8,086</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-dark text-white rounded-circle shadow">
                        <i className="fas fa-boxes" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Inventario</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/tipos-vehiculos")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Tipos de vehículos
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">8,086</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-blue text-white rounded-circle shadow">
                        <i className="fas fa-car" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Tipos de vehículos</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/ventas")}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Ventas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">81,086</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-dollar-sign" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Ventas registradas</span>
                  </p>
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

export default HeaderTallerPintura;