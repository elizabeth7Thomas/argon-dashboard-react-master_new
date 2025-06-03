import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const ModalAgregarDevolucion = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    FechaDevolucion: "",
    Motivo: "",
    idDetalleVenta: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const payload = {
      metadata: {
        uri: "/pinturas/POST/devolucion",
      },
      request: {
        FechaDevolucion: form.FechaDevolucion,
        Motivo: form.Motivo,
        idDetalleVenta: parseInt(form.idDetalleVenta, 10),
      },
    };

    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //"Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Devolución registrada:", data);
        onSubmit(data); // Notifica al componente padre
        toggle(); // Cierra el modal
        setForm({ FechaDevolucion: "", Motivo: "", idDetalleVenta: "" });
      } else {
        const errorData = await response.json();
        console.error("Error al registrar devolución:", errorData);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Registrar Devolución</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Fecha de Devolución</Label>
            <Input
              type="date"
              name="FechaDevolucion"
              value={form.FechaDevolucion}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Motivo</Label>
            <Input
              type="text"
              name="Motivo"
              value={form.Motivo}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>ID Detalle Venta</Label>
            <Input
              type="number"
              name="idDetalleVenta"
              value={form.idDetalleVenta}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Guardar
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarDevolucion;
