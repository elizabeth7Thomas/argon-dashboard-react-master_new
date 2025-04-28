import React, { useState, useEffect } from "react";
import {Modal,ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, } from "reactstrap";

const ModalAgregarTipoPintura = ({ isOpen, toggle, onSubmit, modoEdicion = false, tipoEditar = null }) => {
  const [form, setForm] = useState({ NombreTipoPintura: "" });

  useEffect(() => {
    if (modoEdicion && tipoEditar) {
      setForm({ NombreTipoPintura: tipoEditar.NombreTipoPintura });
    } else {
      setForm({ NombreTipoPintura: "" });
    }
  }, [modoEdicion, tipoEditar]);

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
      <ModalHeader toggle={toggle}>
        {modoEdicion ? "Editar Tipo de Pintura" : "Agregar Tipo de Pintura"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Nombre del Tipo de Pintura</Label>
            <Input
              type="text"
              name="NombreTipoPintura"
              value={form.NombreTipoPintura}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {modoEdicion ? "Guardar Cambios" : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarTipoPintura;
