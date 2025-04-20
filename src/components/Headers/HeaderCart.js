// src/gasoline/Sales/HeaderCart.js
import React from "react";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function HeaderCart() {
  return (
    <div className="header bg-gradient-success pb-6 pt-5 pt-md-6">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6" xs="7">
              <h2 className="text-white mb-0">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Carrito de Ventas
              </h2>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
