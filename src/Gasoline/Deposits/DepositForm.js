// src/gasoline/Deposits/DepositForm.js
import React, { useState, useEffect } from 'react';
import {
  ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';

export default function DepositForm({ onSave, onCancel, initialData }) {
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
 
    </>
  );
}
