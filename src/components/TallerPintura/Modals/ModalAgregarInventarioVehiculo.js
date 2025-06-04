import React, { useState, useEffect } from "react";
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

const ModalAgregarInventarioVehiculo = ({
  isOpen,
  toggle,
  modoEdicion = false,
  vehiculoEditar = null,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    idTipoVehiculo: "",
    idInventario: "",
    CantidadRequerida: "",
  });

  useEffect(() => {
    if (modoEdicion && vehiculoEditar) {
      setForm({
        idTipoVehiculo: vehiculoEditar.idTipoVehiculo,
        idInventario: vehiculoEditar.idInventario,
        CantidadRequerida: vehiculoEditar.CantidadRequerida,
      });
    } else {
      setForm({ idTipoVehiculo: "", idInventario: "", CantidadRequerida: "" });
    }
  }, [modoEdicion, vehiculoEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const uri = modoEdicion
      ? `/pintura/PUT/vehiculoinventarios/${vehiculoEditar.idVehiculoInventario}`
      : "/pintura/POST/vehiculoinventarios";

    const payload = {
      metadata: {
        uri,
      },
      request: {
        idTipoVehiculo: parseInt(form.idTipoVehiculo),
        idInventario: parseInt(form.idInventario),
        CantidadRequerida: parseInt(form.CantidadRequerida),
      },
    };

    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error en la operación.");
      }

      const result = await res.json();
      onSubmit(); // recargar tabla
      toggle(); // cerrar modal
    } catch (error) {
      console.error("Error al guardar inventario vehículo:", error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {modoEdicion ? "Editar Inventario de Vehículo" : "Agregar Inventario de Vehículo"}
      </ModalHeader>
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
        <Button color="primary" onClick={handleSubmit}>
          {modoEdicion ? "Guardar Cambios" : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarInventarioVehiculo;
