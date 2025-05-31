import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  CardBody,
} from "reactstrap";
import {
  faCar,
  faCalendarAlt,
  faClipboardList,
  faChartLine,
  faPaintRoller,
  faCogs,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";
import TablaServicios from "components/TallerPintura/Tables/TablaServicios";
import TablaTipoPinturas from "components/TallerPintura/Tables/TablaTipoPinturas";
import TablaTiposServicios from "components/TallerPintura/Tables/TablaTiposServicios";
import TablaTiposVehiculos from "components/TallerPintura/Tables/TablaTiposVehiculos";

const TallerPinturas = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case "servicios":
        return <TablaServicios />;
      case "tiposPintura":
        return <TablaTipoPinturas />;
      case "tiposServicios":
        return <TablaTiposServicios />;
      case "tiposVehiculos":
        return <TablaTiposVehiculos />;
      default:
        return <p className="text-muted">Selecciona una opción para comenzar.</p>;
    }
  };

  return (
    <>
      <HeaderTallerPintura />

      <Container className="mt-5" fluid>
        {/* Botones de navegación */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button
                  color="primary"
                  onClick={() => setActiveComponent("servicios")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCar} className="mr-2" />
                  Servicios
                </Button>

                <Button
                color="primary"
                  onClick={() => setActiveComponent("tiposPintura")}
                  className="btn-icon"
                 
                >
                  <FontAwesomeIcon icon={faPaintRoller} className="mr-2" />
                  Tipos de Pintura
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("tiposServicios")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Tipos de Servicios
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("tiposVehiculos")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faTruck} className="mr-2" />
                  Tipos de Vehículos
                </Button>

                <Button color="primary" disabled className="btn-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Agenda
                </Button>

                <Button color="primary" disabled className="btn-icon">
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Reportes
                </Button>

                <Button color="primary" disabled className="btn-icon">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Estadísticas
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
                {renderComponent()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TallerPinturas;
