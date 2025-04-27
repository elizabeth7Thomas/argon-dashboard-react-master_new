import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { 
  faFileAlt,

  faCalendarAlt,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const HeaderReports = () => {
  const navigate = useNavigate();
  
  const reportStats = {
    total: { value: 128, route: "/admin/reports" },
    today: { value: 5, route: "/admin/reports/today" },
    pending: { value: 3, route: "/admin/reports/pending" }
  };

  return (
    <div className="header bg-gradient-dark pb-6 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Sistema de Reportes
              </h2>
              <p className="text-white mb-0">
                Genera y administra todos los reportes del sistema
              </p>
            </Col>
            <Col lg="6" className="text-right">
              <button 
                className="btn btn-neutral"
                onClick={() => navigate("/admin/reports/generate")}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-1" /> 
                Nuevo Reporte
              </button>
            </Col>
          </Row>
          
          <Row>
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(reportStats.total.route)}>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Reportes Totales
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{reportStats.total.value}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faFileAlt} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(reportStats.today.route)}>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Reportes Hoy
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{reportStats.today.value}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            
            <Col lg="4">
              <Card className="card-stats mb-4 mb-xl-0 hover-scale" 
                onClick={() => navigate(reportStats.pending.route)}>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Pendientes
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{reportStats.pending.value}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-gradient-warning text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faFilter} />
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
      `}</style>
    </div>
  );
};

export default HeaderReports;