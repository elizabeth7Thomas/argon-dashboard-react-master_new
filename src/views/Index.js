// views/Index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Progress
} from 'reactstrap';
import { 
  faGasPump, 
  faPaintRoller, 
  faTools, 
  faStore,
  faChartLine,
  faCalendarAlt,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Header from "components/Headers/Header";

const Index = () => {
  const navigate = useNavigate();

  // Datos de ejemplo
  const recentActivities = [
    { id: 1, message: "Nuevo servicio en taller de pintura", time: "Hace 15 min", type: "pintura" },
    { id: 2, message: "Venta de $45.50 en tienda", time: "Hace 30 min", type: "tienda" },
    { id: 3, message: "Mantenimiento preventivo completado", time: "Hace 1 hora", type: "mantenimiento" },
    { id: 4, message: "Depósito de combustible al 75%", time: "Hace 2 horas", type: "combustible" }
  ];

  const fuelLevels = [
    { name: "Regular", percentage: 70, color: "success" },
    { name: "Premium", percentage: 44, color: "warning" },
    { name: "Diesel", percentage: 60, color: "info" }
  ];

  return (
    <>
      <Header />
      
      {/* Page content */}
      <Container className="mt-4" fluid>
        {/* Accesos rápidos */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/dashboard')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                  Combustibles
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/taller-pintura')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faPaintRoller} className="mr-2" />
                  Taller Pintura
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/mantenimiento')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  Mantenimiento
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/tienda')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faStore} className="mr-2" />
                  Tienda de Conveniencia
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/dashboard-pagos')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Pagos
                </Button>
                
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/administracion')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                  administracion
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Mapa de ubicación */}
          <Col lg="8" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-0">
                      <i className="ni ni-pin-3 mr-2" />
                      Ubicación de la Estación
                    </h2>
                  </Col>
                  <Col className="text-right">
                    <Button 
                      color="primary" 
                      size="sm"
                      onClick={() => window.open('https://maps.google.com', '_blank')}
                    >
                      Ver en Maps
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="map-container" style={{ height: "350px", width: "100%" }}>
                  <iframe
                    title="Mapa de ubicación"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.6744325374534!2d-91.54019919999992!3d14.84351920000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858e9821d5d018bf%3A0xb35fd953c69529a9!2sFacultad%20de%20Ingenier%C3%ADa%20Universidad%20Mesoamericana!5e0!3m2!1ses-419!2sgt!4v1745596475136!5m2!1ses-419!2sgt"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: "0.375rem" }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Acerca de Nosotros */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h2 className="mb-0">
                  <i className="ni ni-bullet-list-67 mr-2" />
                  Actividad Reciente
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                <ListGroup flush>
                  {recentActivities.map(activity => (
                    <ListGroupItem key={activity.id} className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="mr-3">
                          <Badge 
                            color={
                              activity.type === 'pintura' ? 'warning' :
                              activity.type === 'tienda' ? 'info' :
                              activity.type === 'mantenimiento' ? 'purple' : 'danger'
                            } 
                            pill
                          >
                            {activity.type === 'pintura' ? 'P' : 
                             activity.type === 'tienda' ? 'T' : 
                             activity.type === 'mantenimiento' ? 'M' : 'C'}
                          </Badge>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{activity.message}</h6>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          {/* Niveles de Combustible */}
          <Col lg="6" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h2 className="mb-0">
                  <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                  Niveles de Combustible
                </h2>
              </CardHeader>
              <CardBody>
                {fuelLevels.map((fuel, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="font-weight-bold">{fuel.name}</span>
                      <small>{fuel.percentage}%</small>
                    </div>
                    <Progress
                      color={fuel.color}
                      value={fuel.percentage}
                      className="progress-sm"
                    />
                  </div>
                ))}
                <Button 
                  color="link" 
                  className="px-0"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Ver detalles de combustibles
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* Próximos Eventos */}
          <Col lg="6" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h2 className="mb-0">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Próximos Eventos
                </h2>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  <ListGroupItem className="px-0">
                    <div className="d-flex align-items-center">
                      <div className="mr-3 text-center" style={{ minWidth: '50px' }}>
                        <h5 className="mb-0 text-primary">15</h5>
                        <small className="text-muted">MAY</small>
                      </div>
                      <div>
                        <h6 className="mb-0">Mantenimiento preventivo</h6>
                        <small className="text-muted">Taller de mantenimiento</small>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className="px-0">
                    <div className="d-flex align-items-center">
                      <div className="mr-3 text-center" style={{ minWidth: '50px' }}>
                        <h5 className="mb-0 text-primary">20</h5>
                        <small className="text-muted">MAY</small>
                      </div>
                      <div>
                        <h6 className="mb-0">Entrega de combustible</h6>
                        <small className="text-muted">Proveedor GasoCorp</small>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className="px-0">
                    <div className="d-flex align-items-center">
                      <div className="mr-3 text-center" style={{ minWidth: '50px' }}>
                        <h5 className="mb-0 text-primary">25</h5>
                        <small className="text-muted">MAY</small>
                      </div>
                      <div>
                        <h6 className="mb-0">Capacitación de personal</h6>
                        <small className="text-muted">Sala de reuniones</small>
                      </div>
                    </div>
                  </ListGroupItem>
                </ListGroup>
                <Button 
                  color="link" 
                  className="px-0 mt-3"
                  onClick={() => navigate('/admin/administracion')}
                >
                  Ver calendario completo
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Acerca de Nosotros */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h2 className="mb-0">
                  <i className="ni ni-single-02 mr-2" />
                  Acerca de Nosotros
                </h2>
              </CardHeader>
              <CardBody>
                <p className="mb-4">
                  En nuestra gasolinera, nos dedicamos a brindar un servicio eficiente, seguro y de alta calidad 
                  para satisfacer las necesidades de combustible de nuestros clientes. Operamos con estándares 
                  rigurosos en el abastecimiento, almacenamiento y distribución de gasolina y diésel, garantizando 
                  productos confiables y atención personalizada.
                </p>
                <p>
                  Además, contamos con sistemas modernos de control y monitoreo para asegurar una operación 
                  transparente y responsable con el medio ambiente. Nuestra prioridad es ofrecer una experiencia 
                  rápida y cómoda en cada visita.
                </p>
                <div className="mt-4 d-flex justify-content-between">
                  <div>
                    <h5 className="mb-2">Horario de atención:</h5>
                    <p className="mb-0">Lunes a Viernes: 6:00 AM - 10:00 PM</p>
                    <p>Sábado y Domingo: 7:00 AM - 9:00 PM</p>
                  </div>
                  <div>
                    <h5 className="mb-2">Contacto:</h5>
                    <p className="mb-0">Tel: 2222-2222</p>
                    <p>Email: info@gasolinera.com</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;