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
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        metadata: {
          uri: "/pintura/POST/servicios"
        },
        request: {
          NombreServicio: form.NombreServicio,
          DescripcionServicio: form.DescripcionServicio
        }
      })
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
              id="NombreServicio"
              name="NombreServicio"
              value={form.NombreServicio}
              onChange={handleChange}
              placeholder="Ingrese el nombre del servicio"
            />
          </FormGroup>
          <FormGroup>
            <Label for="DescripcionServicio">Descripción</Label>
            <Input
              id="DescripcionServicio"
              name="DescripcionServicio"
              value={form.DescripcionServicio}
              onChange={handleChange}
              placeholder="Ingrese una descripción"
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
