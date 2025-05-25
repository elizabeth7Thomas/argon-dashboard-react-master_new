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

const ModalAgregarServicio = ({ isOpen, toggle, modoEdicion = false, tipoEditar = null }) => {
  const [form, setForm] = useState({
    NombreServicio: "",
    DescripcionServicio: "",
  });

  useEffect(() => {
    if (modoEdicion && tipoEditar) {
      setForm({
        NombreServicio: tipoEditar.NombreServicio,
        DescripcionServicio: tipoEditar.DescripcionServicio,
      });
    } else {
      setForm({
        NombreServicio: "",
        DescripcionServicio: "",
      });
    }
  }, [modoEdicion, tipoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const nuevoServicio = {
      NombreServicio: form.NombreServicio,
      DescripcionServicio: form.DescripcionServicio,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/pintura/POST/servicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoServicio),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Servicio creado:", data);
        toggle(); // Cierra el modal
        setForm({ NombreServicio: "", DescripcionServicio: "" }); // Limpiar formulario
      } else {
        const errorData = await response.json();
        console.error("Error al crear servicio:", errorData);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar nuevo servicio</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreServicio">Nombre del Servicio</Label>
            <Input
              name="NombreServicio"
              value={form.NombreServicio}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="DescripcionServicio">Descripción</Label>
            <Input
              name="DescripcionServicio"
              value={form.DescripcionServicio}
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

export default ModalAgregarServicio;
