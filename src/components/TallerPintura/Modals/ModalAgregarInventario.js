import React, { useState, useEffect } from "react";
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

const CrearInventarioModal = ({
  isOpen,
  toggle,
  onInventarioCreado,
  modoEdicion = false,
  inventarioEditar = null,
}) => {
  const [formData, setFormData] = useState({
    NombreProducto: "",
    CantidadDisponible: "",
    idTipoPintura: "",
    TipoInventario: "",
    Lote: "",
    CodigoColor: "",
    FechaAdquisicion: "",
    FechaVencimiento: "",
    EstadoInventario: true,
    deleted: false,
  });

  useEffect(() => {
    if (modoEdicion && inventarioEditar) {
      setFormData({
        ...inventarioEditar,
        FechaAdquisicion: inventarioEditar.FechaAdquisicion?.split("T")[0] || "",
        FechaVencimiento: inventarioEditar.FechaVencimiento?.split("T")[0] || "",
      });
    }
  }, [modoEdicion, inventarioEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token de autenticación no encontrado.");
      return;
    }

    const payload = {
      metadata: {
        uri: modoEdicion
          ? `/pintura/PUT/inventarios/${inventarioEditar.idInventario}`
          : "/pintura/POST/inventarios",
      },
      request: {
        ...formData,
        idInventario: modoEdicion ? inventarioEditar.idInventario : 0,
        TipoInventario: parseInt(formData.TipoInventario),
        idTipoPintura: formData.idTipoPintura !== "" ? parseInt(formData.idTipoPintura) : null,
        CantidadDisponible: parseInt(formData.CantidadDisponible),
        deleted: false, // siempre enviar false aquí
      },
    };

    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error al guardar:", error);
        alert("Error al guardar el inventario");
        return;
      }

      alert(modoEdicion ? "Inventario actualizado correctamente" : "Inventario creado");
      toggle();
      if (onInventarioCreado) onInventarioCreado();
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red: " + error.message);
    }
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Crear Inventario</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
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
