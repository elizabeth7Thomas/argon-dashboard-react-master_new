// src/gasoline/Sales/Sales.js
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader,
  Button, Badge, CardBody
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import SaleForm from './SaleForm';
import SaleList from './SaleList';
import HeaderSale from 'components/Headers/HeaderSale';
import CartItem from './SalesCart/CartItem';

export default function Sales() {
  const [showModal, setShowModal] = useState(false);
  const [editSale, setEditSale] = useState(null);

  const [sales, setSales] = useState([
    {
      id: 1,
      producto: 'Gasolina Premium',
      cantidad: '200 L',
      fecha: '2025-04-19',
      monto: '$2,500'
    },
    {
      id: 2,
      producto: 'Diesel',
      cantidad: '150 L',
      fecha: '2025-04-18',
      monto: '$1,800'
    },
    {
      id: 3,
      producto: 'Gasolina Regular',
      cantidad: '300 L',
      fecha: '2025-04-17',
      monto: '$3,000'
    }
  ]);

  const [cart, setCart] = useState([]);

  const toggleForm = () => {
    setShowModal(!showModal);
    setEditSale(null);
  };

  const handleSubmit = (newSale) => {
    if (editSale) {
      setSales(prev => prev.map(s => s.id === newSale.id ? newSale : s));
    } else {
      setSales(prev => [...prev, { ...newSale, id: Date.now() }]);
    }
    toggleForm();
  };

  const handleEdit = (sale) => {
    setEditSale(sale);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta?")) {
      setSales(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddToCart = (sale) => {
    if (!cart.some(item => item.id === sale.id)) {
      setCart([...cart, sale]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <>
      <HeaderSale />
      <Container className="mt-5" fluid>
        {/* Encabezado sección */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                      Gestión de Ventas
                    </h3>
                  </Col>
                  <Col className="text-right">
                    <Badge color="primary" pill>Activo</Badge>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        {/* Botón nueva venta */}
        <Row className="mb-4">
          <Col>
            <Button
              color="success"
              onClick={toggleForm}
              className="btn-icon float-right"
            >
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faPlus} />
              </span>
              <span className="btn-inner--text">Registrar Venta</span>
            </Button>
          </Col>
        </Row>

        {/* Lista de ventas y carrito */}
        <Row>
          <Col md="8">
            <SaleList
              sales={sales}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToCart={handleAddToCart} // <-- nuevo
            />
          </Col>

          <Col md="4">
            <Card className="shadow">
              <CardHeader>
                <h5 className="mb-0">🛒 Carrito de Ventas ({cart.length})</h5>
              </CardHeader>
              <CardBody>
                {cart.length === 0 ? (
                  <p>No hay productos en el carrito.</p>
                ) : (
                  cart.map(item => (
                    <CartItem key={item.id} item={item} onRemove={handleRemoveFromCart} />
                  ))
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal formulario */}
        <SaleForm
          isOpen={showModal}
          toggle={toggleForm}
          onSubmit={handleSubmit}
          formData={editSale || { producto: '', cantidad: '', fecha: '', monto: '' }}
          setFormData={setEditSale}
          isEditing={!!editSale}
        />
      </Container>
    </>
  );
}
