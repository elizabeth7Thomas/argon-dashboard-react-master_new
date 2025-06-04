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

  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [inventarios, setInventarios] = useState([]);

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    obtenerTiposVehiculos();
    obtenerInventarios();
  }, []);

  const obtenerTiposVehiculos = async () => {
    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: { uri: "/pintura/GET/tipovehiculos" },
          request: {},
        }),
      });
      const data = await res.json();
      setTiposVehiculos(data.response?.data || []);
    } catch (err) {
      console.error("Error al cargar tipos de vehículos:", err.message);
    }
  };

  const obtenerInventarios = async () => {
    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: { uri: "/pintura/GET/inventarios" },
          request: {},
        }),
      });
      const data = await res.json();
      setInventarios(data.response?.data || []);
    } catch (err) {
      console.error("Error al cargar inventarios:", err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const uri = modoEdicion
      ? `/pintura/PUT/vehiculoinventarios/${vehiculoEditar.idVehiculoInventario}`
      : "/pintura/POST/vehiculoinventarios";

    const payload = {
      metadata: { uri },
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

      onSubmit();
      toggle();
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
            <Label>Tipo de Vehículo</Label>
            <Input
              type="select"
              name="idTipoVehiculo"
              value={form.idTipoVehiculo}
              onChange={handleChange}
            >
              <option value="">-- Selecciona un tipo --</option>
              {tiposVehiculos.map((tipo) => (
                <option key={tipo.idTipoVehiculo} value={tipo.idTipoVehiculo}>
                  {tipo.NombreTipoVehiculo}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Producto / Inventario</Label>
            <Input
              type="select"
              name="idInventario"
              value={form.idInventario}
              onChange={handleChange}
            >
              <option value="">-- Selecciona un producto --</option>
              {inventarios.map((inv) => (
                <option key={inv.idInventario} value={inv.idInventario}>
                  {inv.NombreProducto}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Cantidad Requerida</Label>
            <Input
              type="number"
              name="CantidadRequerida"
              value={form.CantidadRequerida}
              onChange={handleChange}
              min="1"
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
