// src/gasoline/Sales/SalesCart/CartForm.js
import React, { useState } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';

export default function CartForm({ cart, setCart }) {
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    monto: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = e => {
    e.preventDefault();
    setCart([...cart, { ...formData, id: Date.now(), monto: parseFloat(formData.monto) }]);
    setFormData({ producto: '', cantidad: '', monto: '' });
  };

  return (
    <Form onSubmit={handleAdd} className="mt-4">
      <FormGroup>
        <Input name="producto" placeholder="Producto" value={formData.producto} onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Input name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Input name="monto" placeholder="Monto" type="number" value={formData.monto} onChange={handleChange} required />
      </FormGroup>
      <Button color="primary" type="submit">Agregar al carrito</Button>
    </Form>
  );
}
