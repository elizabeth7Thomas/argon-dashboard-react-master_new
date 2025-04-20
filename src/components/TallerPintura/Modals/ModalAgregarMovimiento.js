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

const ModalAgregarMovimiento = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    TipoMovimiento: "Salida",
    Cantidad: 1,
    FechaMovimiento: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ TipoMovimiento: "Salida", Cantidad: 1, FechaMovimiento: "" });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Movimiento de Inventario</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Tipo de Movimiento</Label>
            <Input
              type="select"
              name="TipoMovimiento"
              value={form.TipoMovimiento}
              onChange={handleChange}
            >
              <option>Salida</option>
              <option>Entrada</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Cantidad</Label>
            <Input
              type="number"
              name="Cantidad"
              value={form.Cantidad}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Fecha del Movimiento</Label>
            <Input
              type="date"
              name="FechaMovimiento"
              value={form.FechaMovimiento}
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

export default ModalAgregarMovimiento;
