import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

export default function ProveedorForm({
  isOpen,
  toggle,
  onGuardar,
  proveedorEditar,
}) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    nit: "",
  });

  useEffect(() => {
    if (proveedorEditar) {
      setForm({
        nombres: proveedorEditar.nombres || "",
        apellidos: proveedorEditar.apellidos || "",
        telefono: proveedorEditar.telefono || "",
        nit: proveedorEditar.nit || "",
      });
    } else {
      setForm({
        nombres: "",
        apellidos: "",
        telefono: "",
        nit: "",
      });
    }
  }, [proveedorEditar, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.telefono.trim() || !form.nit.trim()) return;
    onGuardar(form);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {proveedorEditar ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="nombres">Nombres</Label>
          <Input
            id="nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            placeholder="Nombres"
          />
        </FormGroup>
        <FormGroup>
          <Label for="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
          />
        </FormGroup>
        <FormGroup>
          <Label for="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </FormGroup>
        <FormGroup>
          <Label for="nit">NIT</Label>
          <Input
            id="nit"
            name="nit"
            value={form.nit}
            onChange={handleChange}
            placeholder="NIT"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {proveedorEditar ? "Actualizar" : "Guardar"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}