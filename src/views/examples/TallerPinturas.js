import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  CardBody,
  CardHeader
} from "reactstrap";
import {
  faCar,
  faClipboardList,
  faPaintRoller,
  faCogs,
  faTruck,
  faBoxes,
  faTags,
  faUndo,
  faCashRegister,
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
import TablaMovimientos from "components/TallerPintura/Tables/TablaMovimientos";

const TallerPinturas = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case "servicios": return <TablaServicios />;
      case "tiposPintura": return <TablaTipoPinturas />;
      case "tiposServicios": return <TablaTiposServicios />;
      case "tiposVehiculos": return <TablaTiposVehiculos />;
      case "inventarios": return <TablaInventarios />;
      case "vehiculoinventarios": return <TablaInventarioVehiculos />;
      case "devoluciones": return <TablaDevoluciones />;
      case "ventas": return <TablaVentas />;
      case "precioservicio": return <TablaPrecioServicio />;
      case "movimientos": return <TablaMovimientos />;
      default:
        return (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
            <p className="text-muted" style={{ fontSize: "1.2rem" }}>
              Selecciona una opción del menú para comenzar
            </p>
          </div>
        );
    }
  };

  const botones = [
    { key: "servicios", icon: faCar, label: "Servicios" },
    { key: "tiposPintura", icon: faPaintRoller, label: "Tipos de Pintura" },
    { key: "tiposServicios", icon: faCogs, label: "Tipos de Servicios" },
    { key: "inventarios", icon: faBoxes, label: "Inventarios" },
    { key: "vehiculoinventarios", icon: faTruck, label: "Vehículo Inventarios" },
    { key: "devoluciones", icon: faUndo, label: "Devoluciones" },
    { key: "ventas", icon: faCashRegister, label: "Ventas" },
    { key: "precioservicio", icon: faTags, label: "Precio Servicio" },
    { key: "tiposVehiculos", icon: faTruck, label: "Tipos de Vehículos" },
    { key: "movimientos", icon: faClipboardList, label: "Movimientos" },
  ];

  // Dividir los botones en dos grupos de 5
  const primeraFila = botones.slice(0, 5);
  const segundaFila = botones.slice(5, 10);

  return (
    <>
      <HeaderTallerPintura />

      <Container className="mt-4" fluid>
        {/* Primera fila de botones (5 botones) */}
        <Row className="mb-2">
          <Col>
            <Card className="shadow">
              <CardBody>
                <Row className="justify-content-center">
                  {primeraFila.map((btn) => (
                    <Col key={btn.key} xs="12" sm="6" md="4" lg="2" className="mb-3 mb-lg-0 px-2">
                      <Button
                        color="primary"
                        onClick={() => setActiveComponent(btn.key)}
                        className={`w-100 d-flex align-items-center justify-content-center ${
                          activeComponent === btn.key ? "" : "btn-outline-primary"
                        }`}
                        style={{
                          height: "50px",
                          fontWeight: "500",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                        }}
                      >
                        <FontAwesomeIcon icon={btn.icon} className="mr-2" />
                        {btn.label}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Segunda fila de botones (5 botones) */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody>
                <Row className="justify-content-center">
                  {segundaFila.map((btn) => (
                    <Col key={btn.key} xs="12" sm="6" md="4" lg="2" className="mb-3 mb-lg-0 px-2">
                      <Button
                        color="primary"
                        onClick={() => setActiveComponent(btn.key)}
                        className={`w-100 d-flex align-items-center justify-content-center ${
                          activeComponent === btn.key ? "" : "btn-outline-primary"
                        }`}
                        style={{
                          height: "50px",
                          fontWeight: "500",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                        }}
                      >
                        <FontAwesomeIcon icon={btn.icon} className="mr-2" />
                        {btn.label}
                      </Button>
                    </Col>
                  ))}
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
                <h3 className="mb-0">
                  {activeComponent 
                    ? botones.find(b => b.key === activeComponent)?.label 
                    : "Panel de Taller de Pinturas"}
                </h3>
              </CardHeader>
              <CardBody style={{ minHeight: "400px" }}>
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