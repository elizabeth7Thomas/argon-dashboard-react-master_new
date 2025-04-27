// src/Administracion/Dashboard.js
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
  Button,
  Progress
} from 'reactstrap';
import HeaderAdministracion from "components/Headers/HeaderAdministracion";
import { 
  faUsers, 
  faBell, 
  faSitemap, 
  faUserTag, 
  faTruck, 
  faCogs,
  faBusinessTime,
  faExchangeAlt,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Administracion() {
  const navigate = useNavigate();

  // Datos mockeados para visualización
  const [employeeStats] = useState({
    total: 42,
    active: 38,
    inactive: 4
  });

  const [alerts] = useState([
    { id: 1, message: "Nuevo empleado necesita capacitación", level: "medium", area: "RRHH" },
    { id: 2, message: "Proveedor con retraso en entrega", level: "high", area: "Compras" },
    { id: 3, message: "Actualización de roles pendiente", level: "low", area: "Administración" }
  ]);

  const [areas] = useState([
    { name: "Gasolinera", employees: 15, status: "active" },
    { name: "Tienda", employees: 8, status: "active" },
    { name: "Taller", employees: 5, status: "maintenance" }
  ]);

  return (
    <>
      <HeaderAdministracion />
      <Container className="mt-5" fluid>
        {/* Navegación principal */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/empleados')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Empleados
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => navigate('/admin/alertas')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Alertas
                </Button>
                <Button 
                  color="success" 
                  onClick={() => navigate('/admin/areas')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faSitemap} className="mr-2" />
                  Áreas
                </Button>
                <Button 
                  color="warning" 
                  onClick={() => navigate('/admin/roles')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUserTag} className="mr-2" />
                  Roles
                </Button>
                <Button 
                  color="info" 
                  onClick={() => navigate('/admin/proveedores')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faTruck} className="mr-2" />
                  Proveedores
                </Button>
                <Button 
                  color="purple" 
                  onClick={() => navigate('/admin/servicios')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Servicios
                </Button>
                <Button 
                  color="secondary" 
                  onClick={() => navigate('/admin/jornadas')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faBusinessTime} className="mr-2" />
                  Jornadas
                </Button>
                <Button 
                  color="dark" 
                  onClick={() => navigate('/admin/movimientos')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                  Movimientos
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Resumen rápido */}
        <Row>
          {/* Estadísticas de empleados */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Estadísticas de Empleados
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    Total 
                    <Badge color="primary" pill className="px-3">
                      {employeeStats.total}
                    </Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    Activos 
                    <Badge color="success" pill className="px-3">
                      {employeeStats.active}
                    </Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    Inactivos 
                    <Badge color="secondary" pill className="px-3">
                      {employeeStats.inactive}
                    </Badge>
                  </ListGroupItem>
                </ListGroup>
                <Button 
                  color="primary" 
                  outline 
                  block 
                  className="mt-3"
                  onClick={() => navigate('/admin/empleados')}
                >
                  Ver todos los empleados
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* Alertas recientes */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Alertas Recientes
                </CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <ListGroup flush>
                  {alerts.map(alert => (
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
                            {alert.area}
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

          {/* Distribución por áreas */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faSitemap} className="mr-2" />
                  Distribución por Áreas
                </CardTitle>
              </CardHeader>
              <CardBody>
                {areas.map((area, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="font-weight-bold">{area.name}</span>
                      <small>{area.employees} empleados</small>
                    </div>
                    <Progress
                      value={area.employees}
                      max={employeeStats.active}
                      color={area.status === "active" ? "success" : "warning"}
                    />
                  </div>
                ))}
                <Button 
                  color="success" 
                  outline 
                  block 
                  className="mt-3"
                  onClick={() => navigate('/admin/areas')}
                >
                  Ver todas las áreas
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Acciones rápidas */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardBody className="d-flex flex-wrap gap-3 justify-content-center">
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/empleados/nuevo')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Nuevo Empleado
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => navigate('/admin/alertas/nueva')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Crear Alerta
                </Button>
                <Button 
                  color="success" 
                  onClick={() => navigate('/admin/areas/nueva')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faSitemap} className="mr-2" />
                  Nueva Área
                </Button>
                <Button 
                  color="info" 
                  onClick={() => navigate('/admin/proveedores/nuevo')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faTruck} className="mr-2" />
                  Nuevo Proveedor
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}