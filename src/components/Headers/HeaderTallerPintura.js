import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { 
  faUndo, 
  faBoxes, 
  faDollarSign,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const HeaderTallerPintura = () => {
  const navigate = useNavigate();

  const stats = {
    devoluciones: { value: 3, change: -1, route: "/admin/devoluciones" },
    inventario: { value: "86%", route: "/admin/inventarios" },
    ventas: { value: "$28,450", change: +12.5, route: "/admin/ventas" },
    agenda: { value: 7, route: "/admin/agenda" }
  };

  return (
    <div className="header bg-gradient-success pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Taller de Pinturas</h2>
              <p className="text-white mb-0">Panel de control y gestión de servicios</p>
            </Col>
          </Row>
          
          {/* UNA SOLA FILA con todas las tarjetas */}
          <Row>
            {/* Devoluciones */}
            <Col lg="3" md="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(stats.devoluciones.route)}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Devoluciones
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.devoluciones.value}</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        {stats.devoluciones.change && (
                          <span className={`mr-2 ${stats.devoluciones.change > 0 ? 'text-danger' : 'text-success'}`}>
                            <i className={`fa fa-arrow-${stats.devoluciones.change > 0 ? 'up' : 'down'}`} /> 
                            {Math.abs(stats.devoluciones.change)}%
                          </span>
                        )}
                        <span className="text-nowrap">Últimos 30 días</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faUndo} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col> 
            
            {/* Inventario */}
            <Col lg="3" md="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(stats.inventario.route)}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Nivel de Inventario
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.inventario.value}</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        <span className="text-nowrap">Disponibilidad</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-gray text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faBoxes} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Ventas */}
            <Col lg="3" md="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(stats.ventas.route)}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Ventas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.ventas.value}</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        {stats.ventas.change && (
                          <span className="text-success mr-2">
                            <i className="fa fa-arrow-up" /> {stats.ventas.change}%
                          </span>
                        )}
                        <span className="text-nowrap">Este mes</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faDollarSign} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Agenda */}
            <Col lg="3" md="6" xl="3">
              <Card 
                className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(stats.agenda.route)}
              >
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Citas Hoy
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{stats.agenda.value}</span>
                      <p className="mt-2 mb-0 text-muted text-sm">
                        <span className="text-nowrap">Programadas</span>
                      </p>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
      
      <style jsx>{`
        .hover-scale {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-scale:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .bg-gradient-orange {
          background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
        }
      `}</style>
    </div>
  );
};

export default HeaderTallerPintura;
