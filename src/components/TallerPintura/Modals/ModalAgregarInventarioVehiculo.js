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

const ModalAgregarInventarioVehiculo = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    idTipoVehiculo: "",
    idInventario: "",
    CantidadRequerida: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ idTipoVehiculo: "", idInventario: "", CantidadRequerida: "" });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Inventario de Vehículo</ModalHeader>
      <ModalBody>
        <Form>
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
            <Label>ID Inventario</Label>
            <Input
              type="number"
              name="idInventario"
              value={form.idInventario}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Cantidad Requerida</Label>
            <Input
              type="number"
              name="CantidadRequerida"
              value={form.CantidadRequerida}
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

export default ModalAgregarInventarioVehiculo;
