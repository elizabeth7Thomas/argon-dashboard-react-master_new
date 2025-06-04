import React, { useEffect, useState } from 'react';
import { Button,Card, CardBody,Col, Container, Row,} from 'reactstrap';
import { faUser, faCreditCard, faExchangeAlt, faUndoAlt, faUniversity,faReceipt,faCashRegister,} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// Importar componentes reales
import ClientesPage from './ClientesPage'
import BancosPage from './BancosPage';
import FacturasPage from './FacturasPage';

import DevolucionesPage from './DevolucionesPage';
import MetodosPagoPage from './MetodosPagoPage';
import TransaccionesPage from './TransaccionesPage';
import HeaderPagos from 'components/Headers/HeaderPagos';
import CierreCajaPage from './CierreCajaPage';

export default function DashboardPagos() {
  const [totalPagos, setTotalPagos] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    // Simulación de datos
    setTotalPagos(12500);
  }, []);

  const stats = [
    {
      title: "Total de pagos",
      value: `Q ${totalPagos}`,
      icon: faCreditCard,
      color: "primary",
    },
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case 'clientes':
        return <ClientesPage />;
      case 'metodos':
        return <MetodosPagoPage />;
      case 'transacciones':
        return <TransaccionesPage />;
      case 'devoluciones':
        return <DevolucionesPage  />;
      case 'bancos':
        return <BancosPage />;
      case 'facturas':
        return <FacturasPage />;
      case 'cierres':
        return <CierreCajaPage />; 

      default:
        return <p className="text-muted">Selecciona una opción para comenzar.</p>;
    }
  };

  return (
    <>
      <HeaderPagos />
      <Container className="mt-4" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button onClick={() => setSelectedSection('clientes')} color="primary">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />Clientes
                </Button>
                <Button onClick={() => setSelectedSection('metodos')} color="primary">
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />Métodos
                </Button>
                <Button onClick={() => setSelectedSection('transacciones')} color="primary">
                  <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />Transacciones
                </Button>
                <Button onClick={() => setSelectedSection('devoluciones')} color="primary">
                  <FontAwesomeIcon icon={faUndoAlt} className="mr-2" />Devoluciones
                </Button>
                <Button onClick={() => setSelectedSection('bancos')} color="primary">
                  <FontAwesomeIcon icon={faUniversity} className="mr-2" />Bancos
                </Button>
                <Button onClick={() => setSelectedSection('facturas')} color="primary">
                  <FontAwesomeIcon icon={faReceipt} className="mr-2" />Facturas
                </Button>
                <Button onClick={() => setSelectedSection('cierres')} color="primary">
                  <FontAwesomeIcon icon={faCashRegister} className="mr-2" />Cierres
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

         {/* Contenedor del componente dinámico */}
               <Row>
                 <Col>
                   <Card className="shadow">
                     <div className="card-header bg-transparent">
                       <h3 className="mb-0">Formulario</h3>
                     </div>
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
