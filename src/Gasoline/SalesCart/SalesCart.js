// src/gasoline/Sales/SalesCart/SalesCart.js
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Badge
} from 'reactstrap';
import HeaderCart from 'components/Headers/HeaderCart';
import CartItem from './cartForm';
import CartForm from './cartForm';

export default function SalesCart() {
  const [cart, setCart] = useState([
    {
      id: 1,
      producto: 'Gasolina Premium',
      cantidad: '200 L',
      monto: 2500
    },
    {
      id: 2,
      producto: 'Diesel',
      cantidad: '150 L',
      monto: 1800
    }
  ]);

  const total = cart.reduce((sum, item) => sum + item.monto, 0);

  return (
    <>
      <HeaderCart />
      <Container className="mt-5" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Carrito de Ventas</h3>
                  </Col>
                  <Col className="text-right">
                    <Badge color="info" pill>
                      Total: ${total}
                    </Badge>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <CartForm cart={cart} setCart={setCart} />
      </Container>
    </>
  );
}
