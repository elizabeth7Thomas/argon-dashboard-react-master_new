import React from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button
} from "reactstrap";
import { faCalendarAlt, faCar, faChartLine, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TallerPinturas = () => {
  return (
    <>
      <HeaderTallerPintura />
      
      {/* Contenido principal */}
      <Container className="mt--7" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <div className="p-4">
                <h2 className="mb-0">Gestión Integral del Taller de Pinturas</h2>
                <p className="text-muted mb-0">Panel de control y administración de servicios</p>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* Acciones rápidas */}
        <Row className="mb-4">
          <Col lg="3" md="6" sm="12">
            <Card className="card-stats shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="icon icon-shape bg-gradient-info text-white rounded-circle mb-3">
                  <FontAwesomeIcon icon={faCar} size="lg" />
                </div>
                <h5 className="card-title text-uppercase text-muted mb-2">Nuevo Servicio</h5>
                <p className="text-sm">Registrar un nuevo trabajo de pintura</p>
                <Button color="info" className="mt-2" outline>
                  Crear
                </Button>
              </div>
            </Card>
          </Col>
          
          <Col lg="3" md="6" sm="12">
            <Card className="card-stats shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="icon icon-shape bg-gradient-success text-white rounded-circle mb-3">
                  <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
                </div>
                <h5 className="card-title text-uppercase text-muted mb-2">Agenda</h5>
                <p className="text-sm">Programar citas y seguimientos</p>
                <Button color="success" className="mt-2" outline>
                  Ver agenda
                </Button>
              </div>
            </Card>
          </Col>
          
          <Col lg="3" md="6" sm="12">
            <Card className="card-stats shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="icon icon-shape bg-gradient-warning text-white rounded-circle mb-3">
                  <FontAwesomeIcon icon={faClipboardList} size="lg" />
                </div>
                <h5 className="card-title text-uppercase text-muted mb-2">Reportes</h5>
                <p className="text-sm">Generar informes de productividad</p>
                <Button color="warning" className="mt-2" outline>
                  Generar
                </Button>
              </div>
            </Card>
          </Col>
          
          <Col lg="3" md="6" sm="12">
            <Card className="card-stats shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="icon icon-shape bg-gradient-danger text-white rounded-circle mb-3">
                  <FontAwesomeIcon icon={faChartLine} size="lg" />
                </div>
                <h5 className="card-title text-uppercase text-muted mb-2">Estadísticas</h5>
                <p className="text-sm">Métricas de rendimiento del taller</p>
                <Button color="danger" className="mt-2" outline>
                  Ver análisis
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* Sección de resumen */}
        <Row>
          <Col lg="8">
            <Card className="shadow">
              <div className="card-header bg-transparent">
                <h3 className="mb-0">Actividad Reciente</h3>
              </div>
              <div className="card-body">
                <div className="timeline timeline-one-side">
                  <div className="timeline-block mb-3">
                    <span className="timeline-step bg-info">
                      <i className="ni ni-bell-55" />
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-sm font-weight-bold mb-0">Nuevo servicio registrado</h6>
                      <p className="text-sm mt-1 mb-0">Pintura completa para Toyota Corolla 2022</p>
                      <span className="text-xs text-muted">Hace 15 minutos</span>
                    </div>
                  </div>
                  <div className="timeline-block mb-3">
                    <span className="timeline-step bg-danger">
                      <i className="ni ni-credit-card" />
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-sm font-weight-bold mb-0">Pago recibido</h6>
                      <p className="text-sm mt-1 mb-0">Servicio #4589 - $1,250.00 MXN</p>
                      <span className="text-xs text-muted">Hace 2 horas</span>
                    </div>
                  </div>
                  <div className="timeline-block mb-3">
                    <span className="timeline-step bg-success">
                      <i className="ni ni-check-bold" />
                    </span>
                    <div className="timeline-content">
                      <h6 className="text-sm font-weight-bold mb-0">Servicio completado</h6>
                      <p className="text-sm mt-1 mb-0">Pulido y encerado para Honda Civic</p>
                      <span className="text-xs text-muted">Hoy, 10:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col lg="4">
            <Card className="shadow">
              <div className="card-header bg-transparent">
                <h3 className="mb-0">Estado del Inventario</h3>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-sm font-weight-bold">Pintura Roja</span>
                  <span className="text-sm">15 litros</span>
                </div>
                <div className="progress mb-4">
                  <div 
                    className="progress-bar bg-danger" 
                    role="progressbar" 
                    style={{width: '30%'}}
                  />
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-sm font-weight-bold">Pintura Azul</span>
                  <span className="text-sm">8 litros</span>
                </div>
                <div className="progress mb-4">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{width: '16%'}}
                  />
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-sm font-weight-bold">Pintura Negra</span>
                  <span className="text-sm">22 litros</span>
                </div>
                <div className="progress mb-4">
                  <div 
                    className="progress-bar bg-dark" 
                    role="progressbar" 
                    style={{width: '44%'}}
                  />
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-sm font-weight-bold">Barniz</span>
                  <span className="text-sm">12 litros</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-warning" 
                    role="progressbar" 
                    style={{width: '24%'}}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TallerPinturas;