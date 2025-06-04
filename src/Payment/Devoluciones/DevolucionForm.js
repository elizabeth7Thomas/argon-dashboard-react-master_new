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

    try {
      await axios.post("http://64.23.169.22:3761/broker/api/rest", {
        metadata: { uri: "pagos/devoluciones/crear" },
        request: formData
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      onSuccess();
      toggle();
    } catch (err) {
      alert(err.response?.data?.Mensaje || "Error al crear la devolución");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nueva Devolución</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {["NoTransaccion", "Monto", "Descripcion"].map((field) => (
            <FormGroup key={field}>
              <Label for={field}>{field}</Label>
              <Input
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
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
