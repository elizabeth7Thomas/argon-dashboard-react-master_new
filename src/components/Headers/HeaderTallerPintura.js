//src/components/Headers/HeaderTallerPintura.js
import { Container, Row, Col } from "reactstrap";

const HeaderTallerPintura = () => {
  return (
    <div className="header bg-gradient-info pb-6 pt-5">
      <Container fluid>
        <Row className="justify-content-center align-items-center">
          <Col xs="12" className="text-center">
            <h1 className="text-white fw-bold display-4 m-0">Taller de Pintura</h1>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeaderTallerPintura;
