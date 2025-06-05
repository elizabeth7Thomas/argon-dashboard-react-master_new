import React, { useEffect, useState } from "react";
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

const ModalAgregarServicio = ({
  isOpen,
  toggle,
  modoEdicion = false,
  tipoEditar = null,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    NombreServicio: "",
    DescripcionServicio: "",
    ValidoDev: false,
  });

  useEffect(() => {
    if (modoEdicion && tipoEditar) {
      setForm({
        NombreServicio: tipoEditar.NombreServicio || "",
        DescripcionServicio: tipoEditar.DescripcionServicio || "",
        ValidoDev: tipoEditar.ValidoDev ?? false,
      });
    } else {
      setForm({
        NombreServicio: "",
        DescripcionServicio: "",
        ValidoDev: false,
      });
    }
  }, [modoEdicion, tipoEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload para POST o PUT según modoEdicion
    const payload = {
      metadata: {
        uri: modoEdicion
          ? `/pintura/PUT/servicios/${tipoEditar.idServicio}`
          : "/pintura/POST/servicios",
      },
      request: {
        NombreServicio: form.NombreServicio,
        DescripcionServicio: form.DescripcionServicio,
        ValidoDev: form.ValidoDev,
        deleted: false,
      },
    };

    if (onSubmit) {
      await onSubmit(payload);
    }

    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {modoEdicion ? "Editar Servicio" : "Agregar nuevo servicio"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreServicio">Nombre del Servicio</Label>
            <Input
              type="text"
              id="NombreServicio"
              name="NombreServicio"
              value={form.NombreServicio}
              onChange={handleChange}
              placeholder="Ingrese el nombre del servicio"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="DescripcionServicio">Descripción</Label>
            <Input
              type="text"
              id="DescripcionServicio"
              name="DescripcionServicio"
              value={form.DescripcionServicio}
              onChange={handleChange}
              placeholder="Ingrese una descripción"
              required
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="ValidoDev"
                checked={form.ValidoDev}
                onChange={handleChange}
              />{" "}
              ¿Es válida la devolución?
            </Label>
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

export default ModalAgregarServicio;
