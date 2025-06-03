// src/Gasoline/Dashboard/Dashboard.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import Header from "components/Headers/Header_basic";
import { faGasPump, faExclamationTriangle, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importa tus páginas reales aquí
import AlertsPage from '../pages/PageAlertsGasoline';
import DepositsPage from '../pages/PageDepositsGasoline';
import SalesPage from '../pages/PageSalesGasoline';
import SalesCartPage from '../pages/PageSalesCartGasoline';
import PumpStatusPage from '../pages/PagePumpStatusGasoline';
import GasolineTypesPage from '../pages/PageGasolineTypes';

export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState(null);

  const renderSection = () => {
    switch (selectedSection) {
      case 'alerts':
        return <AlertsPage />;
      case 'deposits':
        return <DepositsPage />;
      case 'sales':
        return <SalesPage />;
      case 'sales-cart':
        return <SalesCartPage />;
      case 'pump-status':
        return <PumpStatusPage />;
      case 'gasoline-types':
        return <GasolineTypesPage />;
      default:
        return <p className="text-muted">Selecciona una opción para comenzar.</p>;
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-4" fluid>
        {/* Navegación principal */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody>
                <Row className="w-100">
                  <Col xs="auto" className="flex-grow-1 text-center">
                    <Button color="primary" onClick={() => setSelectedSection('alerts')} className="btn-icon w-100">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                      Alertas
                    </Button>
                  </Col>
                  <Col xs="auto" className="flex-grow-1 text-center">
                    <Button color="primary" onClick={() => setSelectedSection('deposits')} className="btn-icon w-100">
                      <i className="ni ni-collection mr-2" />
                      Depósitos
                    </Button>
                  </Col>
                  <Col xs="auto" className="flex-grow-1 text-center">
                    <Button color="primary" onClick={() => setSelectedSection('sales')} className="btn-icon w-100">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                      Ventas
                    </Button>
                  </Col>
                  <Col xs="auto" className="flex-grow-1 text-center">
                    <Button color="primary" onClick={() => setSelectedSection('pump-status')} className="btn-icon w-100">
                      <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                      Bombas
                    </Button>
                  </Col>
                  <Col xs="auto" className="flex-grow-1 text-center">
                    <Button color="primary" onClick={() => setSelectedSection('gasoline-types')} className="btn-icon w-100">
                      <i className="ni ni-archive-2 mr-2" />
                      Tipos
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Contenedor del componente dinámico */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Panel</h3>
              </CardHeader>
              <CardBody>
                {renderSection()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
