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
  faClipboardList,
  faPaintRoller,
  faCogs,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";
import TablaServicios from "components/TallerPintura/Tables/TablaServicios";
import TablaTipoPinturas from "components/TallerPintura/Tables/TablaTipoPinturas";
import TablaTiposServicios from "components/TallerPintura/Tables/TablaTiposServicios";
import TablaInventarios from "components/TallerPintura/Tables/TablaInventarios";
import TablaInventarioVehiculos from "components/TallerPintura/Tables/TablaInventarioVehiculos";
import TablaDevoluciones from "components/TallerPintura/Tables/TablaDevoluciones";
import TablaVentas from "components/TallerPintura/Tables/TablaVentas";
import TablaTiposVehiculos from "components/TallerPintura/Tables/TablaTiposVehiculos";
import TablaPrecioServicio from "components/TallerPintura/Tables/TablaPrecioServicio";

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
      case "inventarios":
        return <TablaInventarios />;
      case "vehiculoinventarios":
        return <TablaInventarioVehiculos />;
      case "devoluciones":
        return <TablaDevoluciones />; 
      case "ventas":
        return <TablaVentas />;
      case "precioservicio":
        return <TablaPrecioServicio />;       
      default:
        return <p className="text-muted">Selecciona una opción para comenzar.</p>;
    }
  };

  return (
    <>
      <HeaderTallerPintura />

      <Container className="mt-4" fluid>
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
                  onClick={() => setActiveComponent("inventarios")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Inventarios
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("vehiculoinventarios")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Vehiculo Inventarios
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("devoluciones")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Devoluciones
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("ventas")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Venta
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("precioservicio")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Precio Servicio
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
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                  Reportes
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
