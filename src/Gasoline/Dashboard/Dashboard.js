// src/Gasoline/Dashboard/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from "classnames";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Badge,
  Button
} from 'reactstrap';
import Header from "components/Headers/Header_basic";
import { faGasPump, faExclamationTriangle, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Dashboard() {
  const navigate = useNavigate();

  // Datos mockeados mejorados para visualización
  const [pumpStatus] = useState({ 
    active: 4, 
    inactive: 1, 
    maintenance: 1 
  });
  
  const [tankStats] = useState([
    { name: "Regular", current: 3500, capacity: 5000, percentage: 70 },
    { name: "Premium", current: 2200, capacity: 5000, percentage: 44 },
    { name: "Diesel", current: 4800, capacity: 8000, percentage: 60 }
  ]);
  
  const [sales] = useState({ 
    volume: 1250, 
    total: 4875 
  });
  
  const [recentAlerts] = useState([
    { id: 1, message: "Bomba #3 requiere mantenimiento", level: "high" },
    { id: 2, message: "Depósito Premium bajo al 44%", level: "medium" },
    { id: 3, message: "Promoción activa en gasolina Regular", level: "low" }
  ]);

  return (
    <>
      <Header />
      {/* Ajuste del margen superior - cambiado de mt--7 a mt-5 */}
      <Container className="mt-5" fluid> 
        {/* Eliminé el título duplicado ya que el header básico ya lo incluye */}
        
        {/* Navegación principal - mejorada */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/gasoline/alerts')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Alertas
                </Button>
                <Button 
                  color="success" 
                  onClick={() => navigate('/admin/gasoline/deposits')}
                  className="btn-icon"
                >
                  <i className="ni ni-collection mr-2" />
                  Depósitos
                </Button>
                <Button 
                  color="warning" 
                  onClick={() => navigate('/admin/gasoline/sales')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  Ventas
                </Button>
                <Button 
                  color="info" 
                  onClick={() => navigate('/admin/gasoline/sales-cart')}
                  className="btn-icon"
                >
                  <i className="ni ni-cart mr-2" />
                  Carrito
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => navigate('/admin/gasoline/pump-status')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                  Bombas
                </Button>
                <Button 
                  color="purple" 
                  onClick={() => navigate('/admin/gasoline/gasoline-types')}
                  className="btn-icon"
                >
                  <i className="ni ni-archive-2 mr-2" />
                  Tipos
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Tarjetas informativas principales - optimizadas */}
        <Row>
          {/* Estado de Bombas */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                  Estado de Bombas
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    Activas 
                    <Badge color="success" pill className="px-3">
                      {pumpStatus.active}
                    </Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    Inactivas 
                    <Badge color="secondary" pill className="px-3">
                      {pumpStatus.inactive}
                    </Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    Mantenimiento 
                    <Badge color="warning" pill className="px-3">
                      {pumpStatus.maintenance}
                    </Badge>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>

          {/* Niveles de Depósitos */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <i className="ni ni-collection mr-2" />
                  Niveles de Depósitos
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  {tankStats.map((tank, index) => (
                    <ListGroupItem key={index} className="py-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="font-weight-bold">{tank.name}</span>
                        <small>
                          {tank.current}L / {tank.capacity}L
                        </small>
                      </div>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className={classnames("progress-bar", {
                            "bg-danger": tank.percentage < 25,
                            "bg-warning": tank.percentage >= 25 && tank.percentage < 50,
                            "bg-success": tank.percentage >= 50
                          })}
                          style={{ width: `${tank.percentage}%` }}
                        />
                      </div>
                      <small className="text-muted mt-1 d-block text-right">
                        {tank.percentage}% capacidad
                      </small>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>

          {/* Ventas del Día */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  Ventas del Día
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3 py-2">
                  <span className="font-weight-bold">Volumen:</span>
                  <span className="h5 mb-0">{sales.volume}L</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span className="font-weight-bold">Valor Total:</span>
                  <span className="h5 mb-0 text-success">
                    ${sales.total.toLocaleString()}
                  </span>
                </div>
                <hr />
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate('/admin/gasoline/sales')}
                  >
                    Ver detalle de ventas
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Alertas Recientes - Mejorada */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Alertas Recientes
                </CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <ListGroup flush>
                  {recentAlerts.map(alert => (
                    <ListGroupItem
                      key={alert.id}
                      className={classnames("py-3 px-4", {
                        "bg-danger text-white": alert.level === "high",
                        "bg-warning": alert.level === "medium",
                        "bg-info text-white": alert.level === "low"
                      })}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Badge color="light" className="mr-2">
                            #{alert.id}
                          </Badge>
                          <span>{alert.message}</span>
                        </div>
                        <small>
                          {alert.level === "high" && "CRÍTICA"}
                          {alert.level === "medium" && "ADVERTENCIA"}
                          {alert.level === "low" && "INFORMATIVA"}
                        </small>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}