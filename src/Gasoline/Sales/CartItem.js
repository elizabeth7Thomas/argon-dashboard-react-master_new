// src/gasoline/Sales/SalesCart/CartItem.js
import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function CartItem({ item }) {
  return (
    <Row className="mb-3 align-items-center">
      <Col md="4"><strong>{item.producto}</strong></Col>
      <Col md="3">{item.cantidad}</Col>
      <Col md="3">${item.monto}</Col>
      <Col md="2">
        <Button color="danger" size="sm">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </Col>
    </Row>
  );
}
