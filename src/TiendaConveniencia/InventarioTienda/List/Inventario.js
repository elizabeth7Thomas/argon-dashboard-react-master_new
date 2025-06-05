import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  CardBody
} from "reactstrap";
import {
  faBoxOpen,
  faTags,
  faTrademark,
 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HeaderTienda from "components/Headers/HeaderTienda";
import ProductList from "./ProductList";
import CategoriasList from "./CategoriasList";
import MarcasList from "./MarcasList";


const Inventario = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case "productos":
        return <ProductList />;
      case "categorias":
        return <CategoriasList />;
      case "marcas":
        return <MarcasList />;
      default:
        return <p className="text-muted">Selecciona una opción para comenzar.</p>;
    }
  };

  return (
    <>
      <HeaderTienda />

      <Container className="mt-4" fluid>
        {/* Menú de botones */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button
                  color="primary"
                  onClick={() => setActiveComponent("productos")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                  Productos
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("categorias")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faTags} className="mr-2" />
                  Categorías
                </Button>

                <Button
                  color="primary"
                  onClick={() => setActiveComponent("marcas")}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faTrademark} className="mr-2" />
                  Marcas
                </Button>

                
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Contenedor dinámico */}
        <Row>
          <Col>
            <Card className="shadow">
              <div className="card-header bg-transparent">
                <h3 className="mb-0">Gestión</h3>
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

export default Inventario;