// /src/components/TallerPintura/Modals/AgregarPinturaModal.js
import React, { useState, useEffect } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label, Input
} from "reactstrap";

const AgregarPinturaModal = ({ isOpen, toggle, onSubmit, pinturas }) => {
  const [tiposPinturas, setTiposPinturas] = useState([]);
  const [form, setForm] = useState({
    NombreProducto: "",
    CantidadDisponible: 0,
    idTipoPintura: "",
    TipoInventario: 1,
    Lote: 1,
    CodigoColor: "",
    FechaAdquisicion: "",
    FechaVencimiento: "",
    EstadoInventario: 1
  });

  // Cargar tipos de pintura desde el endpoint
  useEffect(() => {
    const obtenerTiposPintura = async () => {
      try {
        const response = await fetch("http://64.23.169.22:8000/pintura/GET/tipospinturas");
        const data = await response.json();
        setTiposPinturas(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error al obtener tipos de pintura:", error);
      }
    };

    obtenerTiposPintura();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ["CantidadDisponible", "idTipoPintura", "TipoInventario", "Lote", "EstadoInventario"].includes(name)
        ? parseInt(value)
        : value
    });
  };

  const handleSubmit = () => {
    const nuevoInventario = {
      idInventario: (Math.max(...pinturas.map((p) => p.idInventario), 0) || 0) + 1,
      ...form
    };

    onSubmit(nuevoInventario);

    setForm({
      NombreProducto: "",
      CantidadDisponible: 0,
      idTipoPintura: "",
      TipoInventario: 1,
      Lote: 1,
      CodigoColor: "",
      FechaAdquisicion: "",
      FechaVencimiento: "",
      EstadoInventario: 1
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar nueva pintura al inventario</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreProducto">Nombre del producto</Label>
            <Input
              type="text"
              name="NombreProducto"
              id="NombreProducto"
              value={form.NombreProducto}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="CantidadDisponible">Cantidad Disponible</Label>
            <Input
              type="number"
              name="CantidadDisponible"
              id="CantidadDisponible"
              min="0"
              value={form.CantidadDisponible}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="idTipoPintura">Tipo de Pintura</Label>
            <Input
              type="select"
              name="idTipoPintura"
              id="idTipoPintura"
              value={form.idTipoPintura}
              onChange={handleChange}
            >
              <option value="">Seleccione un tipo</option>
              {tiposPinturas.map((tipo) => (
                <option key={tipo.idTipoPintura} value={tipo.idTipoPintura}>
                  {tipo.NombreTipoPintura}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="TipoInventario">Tipo de Inventario</Label>
            <Input
              type="select"
              name="TipoInventario"
              id="TipoInventario"
              value={form.TipoInventario}
              onChange={handleChange}
            >
              <option value={1}>Entrada</option>
              <option value={2}>Salida</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="Lote">Lote</Label>
            <Input
              type="number"
              name="Lote"
              id="Lote"
              min="1"
              value={form.Lote}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="CodigoColor">Código de Color</Label>
            <Input
              type="text"
              name="CodigoColor"
              id="CodigoColor"
              value={form.CodigoColor}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="FechaAdquisicion">Fecha de Adquisición</Label>
            <Input
              type="date"
              name="FechaAdquisicion"
              id="FechaAdquisicion"
              value={form.FechaAdquisicion}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="FechaVencimiento">Fecha de Vencimiento</Label>
            <Input
              type="date"
              name="FechaVencimiento"
              id="FechaVencimiento"
              value={form.FechaVencimiento}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="EstadoInventario">Estado del Inventario</Label>
            <Input
              type="select"
              name="EstadoInventario"
              id="EstadoInventario"
              value={form.EstadoInventario}
              onChange={handleChange}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Agregar</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AgregarPinturaModal;