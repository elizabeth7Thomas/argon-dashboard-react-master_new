// src/gasoline/Sales/SalesCart.js
import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody} from "reactstrap";
import HeaderCart from "./HeaderCart";
import CartForm from "./cartForm";
import CartItem from "./CartItem";

export default function SalesCart({ previousSales }) {
  const [cart, setCart] = useState([]);
  // Removed unused selectedSale state

  const addToCart = (sale) => {
    if (!cart.find(item => item.id === sale.id)) {
      setCart([...cart, sale]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <>
      <HeaderCart />
      <Container className="mt-5" fluid>
        <Row>
          <Col md="6">
            <h4>Ventas Anteriores</h4>
            <CartForm sales={previousSales} onSelect={addToCart} />
          </Col>
          <Col md="6">
            <h4>Carrito Actual</h4>
            <Card className="shadow">
              <CardBody>
                {cart.length === 0 ? (
                  <p>No hay elementos en el carrito.</p>
                ) : (
                  cart.map((item) => (
                    <CartItem key={item.id} item={item} onRemove={removeFromCart} />
                  ))
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
