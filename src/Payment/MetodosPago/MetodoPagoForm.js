// src/Payment/MetodosPago/MetodoPagoForm.js
import React, { useState, useEffect } from "react";
import {
  Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button, Alert
} from "reactstrap";

export default function MetodoPagoForm({
  isOpen, toggle, formData, setFormData, onSubmit, isEditing
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, Metodo: e.target.value });
    // Limpiar errores cuando el usuario escribe
    if (error) setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onSubmit();
      setSuccess(isEditing ? "Método de pago actualizado correctamente" : "Método de pago creado correctamente");
      // Opcional: cerrar el modal después de un tiempo
      setTimeout(() => {
        toggle();
      }, 1500);
    } catch (err) {
      // Manejar diferentes formatos de error
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Ocurrió un error al procesar la solicitud";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Método de Pago" : "Nuevo Método de Pago"}
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        
        <Form onSubmit={handleSave}>
          <FormGroup>
            <Label for="metodo">Método</Label>
            <Input
              type="text"
              name="Metodo"
              id="Metodo"
              value={formData.Metodo || ""}
              onChange={handleChange}
              placeholder="Ej: Efectivo, Tarjeta"
              invalid={!!error}
            />
          </FormGroup>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
          {' '}
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancelar
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}