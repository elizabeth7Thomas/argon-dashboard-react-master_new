import React, { useState } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import axios from 'axios';

const LotesForm = ({ abierto, toggle, onSuccess }) => {
  const [formulario, setFormulario] = useState({
    id_producto: '',
    costo_unitario: '',
    precio_lote: '',
    stock: '',
    fecha_ingreso: '',
    fecha_vencimiento: '',
    descripcion: '',
    usuario_creacion: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const formatearFecha = (fecha) => {
    // Convierte '2025-06-01' en '2025-06-01T00:00:00Z'
    return fecha ? `${fecha}T00:00:00Z` : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formulario,
      id_producto: parseInt(formulario.id_producto),
      costo_unitario: parseFloat(formulario.costo_unitario),
      precio_lote: parseFloat(formulario.precio_lote),
      stock: parseInt(formulario.stock),
      fecha_ingreso: formatearFecha(formulario.fecha_ingreso),
      fecha_vencimiento: formatearFecha(formulario.fecha_vencimiento),
      usuario_creacion: parseInt(formulario.usuario_creacion)
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/POST/lotes/' },
          request: payload
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toggle();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al agregar lote:', error);
    }
  };

  return (
    <Modal isOpen={abierto} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Lote</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>ID Producto</Label>
            <Input type="number" name="id_producto" value={formulario.id_producto} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Costo Unitario</Label>
            <Input type="number" step="0.01" name="costo_unitario" value={formulario.costo_unitario} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Precio Lote</Label>
            <Input type="number" step="0.01" name="precio_lote" value={formulario.precio_lote} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Stock</Label>
            <Input type="number" name="stock" value={formulario.stock} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Fecha Ingreso</Label>
            <Input type="date" name="fecha_ingreso" value={formulario.fecha_ingreso} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Fecha Vencimiento</Label>
            <Input type="date" name="fecha_vencimiento" value={formulario.fecha_vencimiento} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Descripción</Label>
            <Input type="text" name="descripcion" value={formulario.descripcion} onChange={handleChange} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Guardar</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default LotesForm;
