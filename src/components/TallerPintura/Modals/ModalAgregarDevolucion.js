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

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ FechaDevolucion: "", Motivo: "", idDetalleVenta: "" });
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
