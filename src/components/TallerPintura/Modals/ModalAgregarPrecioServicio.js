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

const ModalAgregarPrecioServicio = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    idTipoServicio: "",
    idTipoVehiculo: "",
    Precio: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ idTipoServicio: "", idTipoVehiculo: "", Precio: "" });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Precio de Servicio</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>ID Tipo Servicio</Label>
            <Input
              type="number"
              name="idTipoServicio"
              value={form.idTipoServicio}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>ID Tipo Vehículo</Label>
            <Input
              type="number"
              name="idTipoVehiculo"
              value={form.idTipoVehiculo}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Precio</Label>
            <Input
              type="number"
              step="0.01"
              name="Precio"
              value={form.Precio}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleSubmit}>
          Guardar
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarPrecioServicio;
