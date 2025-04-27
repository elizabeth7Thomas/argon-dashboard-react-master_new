//src/views/examples/TallerPinturas.js
import React from "react";
import {
  Container,
  Card,
} from "reactstrap";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";



const TallerPinturas = () => {

  return (
    <>
      <HeaderTallerPintura />
      <Container className="mt-4">
      <Card className="shadow p-4">
        <h2 className="mb-4">Gestión de Taller de Pinturas</h2>
        </Card>
      </Container>
    </>
  );
};

export default TallerPinturas;
