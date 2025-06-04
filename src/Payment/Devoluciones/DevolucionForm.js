// src/Payment/Devoluciones/DevolucionForm.js
import React, { useState } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from "reactstrap";
import axios from "axios";

export default function DevolucionForm({ isOpen, toggle, onSuccess }) {
  const [formData, setFormData] = useState({
    NoTransaccion: "",
    Monto: "",
    Descripcion: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Parsear Monto a número, asumiendo que el backend espera número
    const payload = {
      metadata: { uri: "pagos/devoluciones/crear" },
      request: {
        ...formData,
        Monto: parseFloat(formData.Monto)
      }
    };

    try {
      await axios.post("http://64.23.169.22:3761/broker/api/rest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      onSuccess();
      toggle();
    } catch (err) {
      const mensaje =
        err?.response?.data?._broker_message ||
        err?.response?.data?.mensaje ||
        "Error inesperado al crear la devolución";
      alert(mensaje);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nueva Devolución</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {[
            ["NoTransaccion", "Número de Transacción"],
            ["Monto", "Monto"],
            ["Descripcion", "Descripción"]
          ].map(([field, label]) => (
            <FormGroup key={field}>
              <Label for={field}>{label}</Label>
              <Input
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                type={field === "Monto" ? "number" : "text"}
                step={field === "Monto" ? "0.01" : undefined}
                min={field === "Monto" ? "0" : undefined}
              />
            </FormGroup>
          ))}
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancelar</Button>
            <Button color="primary" type="submit">Crear</Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
}
