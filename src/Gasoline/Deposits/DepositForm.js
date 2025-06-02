// src/gasoline/Deposits/DepositForm.js
import React, { useState, useEffect } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';

export default function DepositForm({ isOpen, onSave, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    maxCapacity: '',
    currentCapacity: '',
    fuel: { fuelId: '', fuelName: '' }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        maxCapacity: initialData.maxCapacity || '',
        currentCapacity: initialData.currentCapacity || '',
        fuel: {
          fuelId: initialData.fuel?.fuelId || '',
          fuelName: initialData.fuel?.fuelName || ''
        }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fuelName" || name === "fuelId") {
      setFormData(prev => ({
        ...prev,
        fuel: { ...prev.fuel, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>Formulario de Depósito</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label>Capacidad Máxima (gal)</Label>
            <Input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Capacidad Actual (gal)</Label>
            <Input type="number" name="currentCapacity" value={formData.currentCapacity} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Nombre de Combustible</Label>
            <Input type="text" name="fuelName" value={formData.fuel.fuelName} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>ID de Combustible</Label>
            <Input type="text" name="fuelId" value={formData.fuel.fuelId} onChange={handleChange} required />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">Guardar</Button>{' '}
          <Button color="secondary" onClick={onCancel}>Cancelar</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

