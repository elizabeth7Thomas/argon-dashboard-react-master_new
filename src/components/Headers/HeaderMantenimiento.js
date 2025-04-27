
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";



const HeaderMantenimiento = () => {
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
  onClick={() => navigate("/admin/inventarioMantenimiento")}
>
  <CardBody>
    <Row>
      <div className="col">
        <CardTitle
          tag="h5"
          className="text-uppercase text-muted mb-0"
        >
          Inventario
        </CardTitle>
        <span className="h2 font-weight-bold mb-0">
          350,897
        </span>
      </div>
      <Col className="col-auto">
        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
          <i className="fas fa-chart-bar" />
        </div>
      </Col>
    </Row>
    <p className="mt-3 mb-0 text-muted text-sm">
      <span className="text-success mr-2">
        <i className="" /> 
      </span>{" "}
      <span className="text-nowrap"></span>
    </p>
  </CardBody>
</Card>

              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Servicios
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">2,356</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="ni ni-satisfied" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="" /> 
                      </span>{" "}
                      <span className="text-nowrap"></span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                <Card
                      className="card-stats mb-4 mb-xl-0" 
                      style={{ cursor: "pointer" }} 
                      onClick={() => navigate("/admin/proveedoresTienda")}
                      >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Proveedores
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">924</span>
                      </div>
                      <Col className="col-auto">
                     
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="ni ni-delivery-fast" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="" /> 
                      </span>{" "}
                      <span className="text-nowrap"></span>
                    </p>
                  </CardBody>
                  </Card>
                  </Card>
                
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <Card
                className="card-stats mb-4 mb-xl-0" 
                style={{ cursor: "pointer" }} 
                onClick={() => navigate("/admin/reportesTienda")}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Reportes 
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">49,65%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="ni ni-chart-bar-32" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="" /> 
                      </span>{" "}
                      <span className="text-nowrap"></span>
                    </p>
                  </CardBody>
                  </Card>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default HeaderMantenimiento;
