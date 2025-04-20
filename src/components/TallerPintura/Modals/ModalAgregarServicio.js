import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Form } from "reactstrap";

const ModalAgregarServicio = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    NombreServicio: "",
    DescripcionServicio: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ NombreServicio: "", DescripcionServicio: "" });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar nuevo servicio</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreServicio">Nombre del Servicio</Label>
            <Input name="NombreServicio" value={form.NombreServicio} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="DescripcionServicio">Descripción</Label>
            <Input name="DescripcionServicio" value={form.DescripcionServicio} onChange={handleChange} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Agregar</Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarServicio;
