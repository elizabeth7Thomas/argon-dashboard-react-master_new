// src/gasoline/Sales/Sales.js
import React, { useState, useCallback } from 'react';

import {
  Container, Row, Col, Card, CardHeader,
  Button, Badge, CardBody
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import SaleForm from '../Sales/SaleForm';
import SaleList from '../Sales/SaleList';
import HeaderSale from 'components/Headers/HeaderSale';
import CartItem from '../Sales/SalesCart/CartItem';

// Datos mock movidos a constantes separadas
const PAYMENT_METHODS = [
  { id: 'cash', name: 'Efectivo' },
  { id: 'credit_card', name: 'Tarjeta de Crédito' },
  { id: 'bank_transfer', name: 'Transferencia Bancaria' },
];

const INITIAL_SALES = [
  {
    id: 1,
    product: 'Gasolina Premium',
    quantity: 200,
    unit: 'L',
    date: '2025-04-19',
    amount: 2500,
    paymentMethod: 'cash'
  },
  {
    id: 2,
    product: 'Diesel',
    quantity: 150,
    unit: 'L',
    date: '2025-04-18',
    amount: 1800,
    paymentMethod: 'credit_card'
  },
  {
    id: 3,
    product: 'Gasolina Regular',
    quantity: 300,
    unit: 'L',
    date: '2025-04-17',
    amount: 3000,
    paymentMethod: 'bank_transfer'
  }
];

const Sales = () => {
  const [showModal, setShowModal] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [cart, setCart] = useState([]);

  const toggleForm = useCallback(() => {
    setShowModal(prev => !prev);
    if (showModal) setEditSale(null);
  }, [showModal]);

  const handleSubmit = useCallback((newSale) => {
    setSales(prev => {
      if (newSale.id) {
        // Edición existente
        return prev.map(s => s.id === newSale.id ? newSale : s);
      }
      // Nueva venta
      return [...prev, { 
        ...newSale, 
        id: Date.now(),
        unit: 'L' // Unidad por defecto
      }];
    });
    setShowModal(false);
  }, []);

  const handleEdit = useCallback((sale) => {
    setEditSale(sale);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((id) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta?")) {
      setSales(prev => prev.filter(s => s.id !== id));
      // También eliminar del carrito si está presente
      setCart(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const handleAddToCart = useCallback((sale) => {
    setCart(prev => 
      prev.some(item => item.id === sale.id) 
        ? prev 
        : [...prev, sale]
    );
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    
    alert(`Venta procesada con ${cart.length} productos`);
    setCart([]);
  }, [cart]);

  // Formatear cantidad para mostrar
  const formatQuantity = (item) => `${item.quantity} ${item.unit}`;
  
  // Formatear monto para mostrar
  const formatAmount = (amount) => `$${amount.toLocaleString()}`;

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
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Gestión de Ventas
                    </h3>
                  </Col>
                  <Col className="text-end">
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
              className="btn-icon float-end"
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
              sales={sales.map(sale => ({
                ...sale,
                quantityDisplay: formatQuantity(sale),
                amountDisplay: formatAmount(sale.amount)
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToCart={handleAddToCart}
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
                  <>
                    {cart.map(item => (
                      <CartItem 
                        key={item.id} 
                        item={{
                          ...item,
                          quantityDisplay: formatQuantity(item),
                          amountDisplay: formatAmount(item.amount)
                        }} 
                        onRemove={handleRemoveFromCart} 
                      />
                    ))}
                    <Button 
                      color="primary" 
                      className="mt-3 w-100"
                      onClick={handleCheckout}
                    >
                      Procesar Venta
                    </Button>
                  </>
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
          formData={editSale || { 
            product: '', 
            quantity: '', 
            date: new Date().toISOString().split('T')[0], 
            amount: '', 
            paymentMethod: 'cash' 
          }}
          paymentMethods={PAYMENT_METHODS}
          isEditing={!!editSale}
        />
      </Container>
    </>
  );
};

Sales.propTypes = {
  // Si este componente recibiera props, se definirían aquí
};

export default Sales;