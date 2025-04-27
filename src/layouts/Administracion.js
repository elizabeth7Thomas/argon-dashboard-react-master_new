import React from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import HeaderAdministracion from "components/Headers/HeaderAdministracion.js";

const Administracion = () => {
  return (
    <>
      <HeaderAdministracion />

      <Container className="mt--6" fluid>
        <Row>
          {[
            { title: "Empleados", color: "primary" },
            { title: "Alertas", color: "danger" },
            { title: "Áreas", color: "info" },
            { title: "Roles", color: "success" },
            { title: "Jornadas", color: "warning" },
            { title: "Proveedores", color: "default" },
            { title: "Servicios", color: "secondary" },
            { title: "Tipos de Movimientos", color: "dark" },
            { title: "Movimientos", color: "info" }
          ].map((modulo, idx) => (
            <Col md="6" lg="4" key={idx} className="mb-4">
              <Card className={`bg-gradient-${modulo.color} shadow`}>
                <CardBody className="d-flex flex-column justify-content-between h-100">
                  <div>
                    <h5 className="text-white">{modulo.title}</h5>
                    <p className="text-white-50 mb-2">
                      Gestión completa de {modulo.title.toLowerCase()}.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Button color="light" size="sm">
                      Ver {modulo.title}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Administracion;
