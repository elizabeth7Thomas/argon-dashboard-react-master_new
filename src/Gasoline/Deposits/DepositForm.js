// src/gasoline/Deposits/DepositForm.js
import React, { useState, useEffect } from 'react';
import {
  ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';

export default function DepositForm({ onSave, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    maxCapacity: '',
    actualQuantity: '',
    fuel: { fuelId: '', fuelName: '' }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fuelName") {
      setFormData({ ...formData, fuel: { ...formData.fuel, fuelName: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <ModalHeader toggle={onCancel}>
        {initialData ? "Editar Depósito" : "Nuevo Depósito"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Capacidad Máxima</Label>
            <Input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Cantidad Actual</Label>
            <Input
              type="number"
              name="actualQuantity"
              value={formData.actualQuantity}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Nombre del Combustible</Label>
            <Input
              type="text"
              name="fuelName"
              value={formData.fuel.fuelName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <ModalFooter>
            <Button color="secondary" onClick={onCancel}>Cancelar</Button>
            <Button color="success" type="submit">Guardar</Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </>
  );
}
