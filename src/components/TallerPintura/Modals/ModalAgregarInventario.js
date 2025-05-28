import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";

const CrearInventarioModal = ({ isOpen, toggle }) => {
  const [formData, setFormData] = useState({
    accion: "crear",
    TipoInventario: "",
    NombreProducto: "",
    idTipoPintura: "",
    Lote: "",
    CodigoColor: "",
    CantidadDisponible: "",
    FechaAdquisicion: "",
    FechaVencimiento: "",
    EstadoInventario: true,
    deleted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/pintura/POST/inventarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          TipoInventario: parseInt(formData.TipoInventario),
          idTipoPintura: formData.idTipoPintura ? parseInt(formData.idTipoPintura) : null,
          CantidadDisponible: parseInt(formData.CantidadDisponible),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error al crear inventario:", error);
        alert("Error: " + JSON.stringify(error.detail));
        return;
      }

      const data = await response.json();
      console.log("Inventario creado:", data);
      alert("Inventario creado exitosamente");
      toggle(); // cerrar modal
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red: " + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Crear Inventario</ModalHeader>
      <ModalBody>
        <Form>
          <Input type="hidden" name="accion" value="crear" />

          <FormGroup>
            <Label for="TipoInventario">Tipo de Inventario</Label>
            <Input
              id="TipoInventario"
              name="TipoInventario"
              type="number"
              value={formData.TipoInventario}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="NombreProducto">Nombre del Producto</Label>
            <Input
              id="NombreProducto"
              name="NombreProducto"
              type="text"
              value={formData.NombreProducto}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="idTipoPintura">Tipo de Pintura (opcional)</Label>
            <Input
              id="idTipoPintura"
              name="idTipoPintura"
              type="number"
              value={formData.idTipoPintura}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="Lote">Lote</Label>
            <Input
              id="Lote"
              name="Lote"
              type="text"
              value={formData.Lote}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="CodigoColor">Código de Color</Label>
            <Input
              id="CodigoColor"
              name="CodigoColor"
              type="text"
              value={formData.CodigoColor}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="CantidadDisponible">Cantidad Disponible</Label>
            <Input
              id="CantidadDisponible"
              name="CantidadDisponible"
              type="number"
              value={formData.CantidadDisponible}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="FechaAdquisicion">Fecha de Adquisición</Label>
            <Input
              id="FechaAdquisicion"
              name="FechaAdquisicion"
              type="date"
              value={formData.FechaAdquisicion}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="FechaVencimiento">Fecha de Vencimiento</Label>
            <Input
              id="FechaVencimiento"
              name="FechaVencimiento"
              type="date"
              value={formData.FechaVencimiento}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="EstadoInventario"
                checked={formData.EstadoInventario}
                onChange={handleChange}
              />
              Inventario Activo
            </Label>
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

export default CrearInventarioModal;
