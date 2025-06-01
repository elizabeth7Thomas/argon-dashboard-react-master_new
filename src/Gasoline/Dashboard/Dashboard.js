// src/Gasoline/Dashboard/Dashboard.js
import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import classnames from "classnames";
import {Container,Row,Col,Card,CardHeader,CardBody,/*CardTitle,ListGroup,ListGroupItem,Badge,*/ Button} from 'reactstrap';
import Header from "components/Headers/Header_basic";
import { faGasPump, faExclamationTriangle, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importa tus componentes de páginas reales aquí
import AlertsPage from '../pages/PageAlertsGasoline';
import DepositsPage from '../pages/PageDepositsGasoline';
import SalesPage from '../pages/PageSalesGasoline';
import SalesCartPage from '../pages/PageSalesCartGasoline';
import PumpStatusPage from '../pages/PagePumpStatusGasoline';
import GasolineTypesPage from '../pages/PageGasolineTypes';

export default function Dashboard() {
// Estado para la sección seleccionada
  const [selectedSection, setSelectedSection] = useState(null);
/* 
  // Datos mockeados para tarjetas informativas
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
*/
  // Render dinámico del componente según la sección seleccionada
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
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button 
                  color="primary" 
                  onClick={() => setSelectedSection('alerts')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Alertas
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => setSelectedSection('deposits')}
                  className="btn-icon"
                >
                  <i className="ni ni-collection mr-2" />
                  Depósitos
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => setSelectedSection('sales')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  Ventas
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => setSelectedSection('sales-cart')}
                  className="btn-icon"
                >
                  <i className="ni ni-cart mr-2" />
                  Carrito
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => setSelectedSection('pump-status')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                  Bombas
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => setSelectedSection('gasoline-types')}
                  className="btn-icon"
                >
                  <i className="ni ni-archive-2 mr-2" />
                  Tipos
                </Button>
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