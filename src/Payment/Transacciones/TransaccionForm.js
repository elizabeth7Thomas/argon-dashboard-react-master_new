import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";

export default function TransaccionForm({
  isOpen,
  toggle,
  formData,
  setFormData,
  onSuccess,
  isEditing,
  idTransaccion,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      metadata: {
        uri: isEditing
          ? `pagos/transacciones/actualizar/${idTransaccion}`
          : "pagos/transacciones/crear",
      },
      request: {
        Monto: parseFloat(formData.monto),
        Fecha: formData.fecha,
        MetodoPago: formData.metodoPago,
        BancoId: formData.bancoId,
        ClienteId: formData.clienteId,
      },
    };

    try {
      await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Transacción" : "Nueva Transacción"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="monto">Monto</Label>
            <Input
              id="monto"
              name="monto"
              type="number"
              value={formData.monto || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="fecha">Fecha</Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="metodoPago">Método de Pago</Label>
            <Input
              id="metodoPago"
              name="metodoPago"
              value={formData.metodoPago || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="bancoId">ID Banco</Label>
            <Input
              id="bancoId"
              name="bancoId"
              value={formData.bancoId || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="clienteId">ID Cliente</Label>
            <Input
              id="clienteId"
              name="clienteId"
              value={formData.clienteId || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancelar
            </Button>
            <Button color="success" type="submit">
              {isEditing ? "Guardar Cambios" : "Guardar"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
}
