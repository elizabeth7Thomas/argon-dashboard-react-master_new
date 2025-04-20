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

const ModalAgregarTipoPintura = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({ NombreTipoPintura: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.NombreTipoPintura.trim() !== "") {
      onSubmit(form);
      setForm({ NombreTipoPintura: "" });
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Tipo de Pintura</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreTipoPintura">Nombre del Tipo de Pintura</Label>
            <Input
              type="text"
              name="NombreTipoPintura"
              value={form.NombreTipoPintura}
              onChange={handleChange}
              placeholder="Ej: Azul metálico"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Agregar
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarTipoPintura;
