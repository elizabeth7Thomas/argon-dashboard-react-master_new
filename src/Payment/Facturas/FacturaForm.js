import React from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from "reactstrap";

function FacturaForm({ isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nueva Factura</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>No. Factura</Label>
            <Input placeholder="Auto-generado o definido por el backend" disabled />
          </FormGroup>
          <FormGroup>
            <Label>Cliente</Label>
            <Input placeholder="Selecciona el cliente (no implementado)" disabled />
          </FormGroup>
          <FormGroup>
            <Label>Productos</Label>
            <Input placeholder="Agregar productos (no implementado)" disabled />
          </FormGroup>
        </Form>
        <p className="text-muted mt-2">* Este formulario es solo ilustrativo.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
}

export default FacturaForm;
