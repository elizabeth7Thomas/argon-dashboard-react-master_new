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

const ModalEmpleado = ({ isOpen, toggle, empleado, onSubmit }) => {
  const [form, setForm] = useState({
    dpi: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    nit: "",
    idJornada: "",
    genero: "",
    idArea: "",
    rol: "",
  });

  useEffect(() => {
    if (empleado) {
      setForm({
        dpi: empleado.dpi,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        nit: empleado.nit,
        idJornada: empleado.idJornada,
        genero: empleado.genero,
        idArea: empleado.idArea,
        rol: empleado.rol,
      });
    }
  }, [empleado]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({
      dpi: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      nit: "",
      idJornada: "",
      genero: "",
      idArea: "",
      rol: "",
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{empleado ? "Editar" : "Agregar"} Empleado</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="dpi">DPI</Label>
            <Input
              name="dpi"
              value={form.dpi}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="nombres">Nombres</Label>
            <Input
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="apellidos">Apellidos</Label>
            <Input
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="telefono">Teléfono</Label>
            <Input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="direccion">Dirección</Label>
            <Input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="nit">NIT</Label>
            <Input
              name="nit"
              value={form.nit}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="idJornada">ID Jornada</Label>
            <Input
              name="idJornada"
              value={form.idJornada}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="genero">Género</Label>
            <Input
              name="genero"
              value={form.genero}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="idArea">ID Area</Label>
            <Input
              name="idArea"
              value={form.idArea}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="rol">Rol</Label>
            <Input
              name="rol"
              value={form.rol}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {empleado ? "Actualizar" : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEmpleado;
