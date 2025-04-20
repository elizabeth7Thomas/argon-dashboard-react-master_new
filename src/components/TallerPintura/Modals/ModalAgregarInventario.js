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

const ModalAgregarInventario = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    NombreProducto: "",
    CantidadDisponible: 0,
    idTipoPintura: "",
    TipoInventario: 1,
    Lote: 1,
    CodigoColor: "",
    FechaAdquisicion: "",
    FechaVencimiento: "",
    EstadoInventario: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({
      NombreProducto: "",
      CantidadDisponible: 0,
      idTipoPintura: "",
      TipoInventario: 1,
      Lote: 1,
      CodigoColor: "",
      FechaAdquisicion: "",
      FechaVencimiento: "",
      EstadoInventario: 1,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Inventario</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Nombre del Producto</Label>
            <Input
              name="NombreProducto"
              value={form.NombreProducto}
              onChange={handleChange}
              placeholder="Ej: Pintura Azul"
            />
          </FormGroup>
          <FormGroup>
            <Label>Cantidad Disponible</Label>
            <Input
              type="number"
              name="CantidadDisponible"
              value={form.CantidadDisponible}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>ID Tipo Pintura</Label>
            <Input
              type="number"
              name="idTipoPintura"
              value={form.idTipoPintura}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Tipo Inventario</Label>
            <Input
              type="number"
              name="TipoInventario"
              value={form.TipoInventario}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Lote</Label>
            <Input
              type="number"
              name="Lote"
              value={form.Lote}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Código de Color</Label>
            <Input
              name="CodigoColor"
              value={form.CodigoColor}
              onChange={handleChange}
              placeholder="Ej: AZL456"
            />
          </FormGroup>
          <FormGroup>
            <Label>Fecha de Adquisición</Label>
            <Input
              type="date"
              name="FechaAdquisicion"
              value={form.FechaAdquisicion}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Fecha de Vencimiento</Label>
            <Input
              type="date"
              name="FechaVencimiento"
              value={form.FechaVencimiento}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Estado Inventario</Label>
            <Input
              type="number"
              name="EstadoInventario"
              value={form.EstadoInventario}
              onChange={handleChange}
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

export default ModalAgregarInventario;
