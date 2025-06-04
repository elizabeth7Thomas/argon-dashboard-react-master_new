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
        return <p className="text-muted text-center">Selecciona una opción para comenzar.</p>;
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

  return (
    <>
      <HeaderTallerPintura />

      <Container className="mt-4" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow border-0">
              <CardBody
  className="d-flex flex-wrap justify-content-center"
  style={{
    gap: "1.5rem", // espacio entre botones (aumentado)
    padding: "2rem",
  }}
>
  {botones.map((btn) => (
    <Button
      key={btn.key}
      color="primary"
      outline={activeComponent !== btn.key}
      onClick={() => setActiveComponent(btn.key)}
      className="d-flex align-items-center justify-content-center gap-2"
      style={{
        minWidth: "220px",
        height: "55px",
        fontWeight: "500",
        borderRadius: "14px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "1rem",
        margin: "0.5rem", // separación adicional entre botones
      }}
    >
      <FontAwesomeIcon icon={btn.icon} />
      {btn.label}
    </Button>
  ))}
</CardBody>

            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow border-0">
              <div className="card-header bg-light">
                <h3 className="mb-0">Sección Activa</h3>
              </div>
              <CardBody style={{ minHeight: "300px" }}>
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
