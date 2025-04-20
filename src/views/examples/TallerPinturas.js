import React, { useEffect, useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Card,
  CardBody,
} from "reactstrap";
import classnames from "classnames";
import Header2 from "components/Headers/Header2";

// Componentes individuales
import Servicios from "../../components/TallerPintura/Tables/TablaServicios";
import TiposServicios from "../../components/TallerPintura/Tables/TablaTiposServicios";
import TiposVehiculos from "../../components/TallerPintura/Tables/TablaTiposVehiculos";
import TiposPinturas from "../../components/TallerPintura/Tables/TablaTipoPinturas";
import Inventario from "../../components/TallerPintura/Tables/TablaInventarios";
import Ventas from "../../components/TallerPintura/Tables/TablaVentas";
import PreciosServicios from "../../components/TallerPintura/Tables/TablaPrecioServicio";

const TallerPinturas = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [pinturas, setPinturas] = useState([]);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };


  const fetchPinturas = async () => {
    try {
      const response = await fetch("http://localhost:8000/pintura/GET/inventarios", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setPinturas(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error al obtener pinturas:", error);
    }
  };

  useEffect(() => {

    fetchPinturas();
  }, []);

  return (
    <>
      <Header2 />
      <Container className="mt-4">
      <Card className="shadow p-4">
        <h2 className="mb-4">Gestión de Taller de Pinturas</h2>

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggle("1")}
            >
              Servicios
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggle("2")}
            >
              Tipos de Servicios
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => toggle("3")}
            >
              Tipos de Vehículos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "4" })}
              onClick={() => toggle("4")}
            >
              Tipos de Pinturas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "5" })}
              onClick={() => toggle("5")}
            >
              Inventario
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "6" })}
              onClick={() => toggle("6")}
            >
              Ventas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "7" })}
              onClick={() => toggle("7")}
            >
              Precios de Servicios
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} className="mt-4">
          <TabPane tabId="1">
            <Card>
              <CardBody>
                <Servicios/>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Card>
              <CardBody>
                <TiposServicios />
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="3">
            <Card>
              <CardBody>
                <TiposVehiculos />
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="4">
            <Card>
              <CardBody>
                <TiposPinturas />
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="5">
            <Card>
              <CardBody>
                <Inventario pinturas={pinturas} />
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="6">
            <Card>
              <CardBody>
                <Ventas />
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="7">
            <Card>
              <CardBody>
                <PreciosServicios />
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
        </Card>
      </Container>
    </>
  );
};

export default TallerPinturas;
