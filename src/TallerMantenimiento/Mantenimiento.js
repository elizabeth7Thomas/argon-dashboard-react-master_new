import React, { useState } from 'react';
import HeaderMantenimiento from 'components/Headers/HeaderMantenimiento';
import ProductosMantenimiento from './ProductosMantenimiento';
import Clientes from './Clientes';
import VehiculosMantenimiento from './VehiculosMantenimiento/VehiculosMantenimiento';

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge
} from "reactstrap";
import {
  faUsers,
  faCogs,
  faCar,
  faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Mantenimiento = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const secciones = [
    { id: 'clientes', label: 'Clientes', icon: faUsers, color: 'primary' },
    { id: 'productos', label: 'Productos', icon: faCogs, color: 'success' },
    { id: 'vehiculos', label: 'Vehículos', icon: faCar, color: 'warning' },
    { id: 'ventas', label: 'Ventas', icon: faFileInvoice, color: 'danger' },
  ];

  return (
    <>
      <HeaderMantenimiento />
      <Container className="mt--7" fluid>
        <Row>
          <Col md="4">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Menú de Mantenimiento</h3>
              </CardHeader>
              <CardBody>
                {secciones.map((s) => (
                  <Button
                    key={s.id}
                    color={s.color}
                    className="d-block w-100 mb-3 text-left"
                    onClick={() => setSelectedSection(s.id)}
                  >
                    <FontAwesomeIcon icon={s.icon} className="mr-2" />
                    {s.label}
                    {selectedSection === s.id && (
                      <Badge color="light" className="ml-2">Activo</Badge>
                    )}
                  </Button>
                ))}
              </CardBody>
            </Card>
          </Col>

          <Col md="8">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">
                  {selectedSection
                    ? `Gestión de ${secciones.find(s => s.id === selectedSection)?.label}`
                    : 'Seleccione una sección'}
                </h3>
              </CardHeader>
              <CardBody>
                {selectedSection === 'clientes' && <Clientes />}
                {selectedSection === 'productos' && <ProductosMantenimiento />}
                {selectedSection === 'vehiculos' && <VehiculosMantenimiento />}
                {selectedSection === 'ventas' && (
                  <p>🚧 Módulo de ventas en construcción...</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Mantenimiento;
