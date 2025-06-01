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

const ModalAgregarTipoPintura = ({
  isOpen,
  toggle,
  onSubmit,
  modoEdicion = false,
  tipoEditar = null,
}) => {
  const [form, setForm] = useState({ NombreTipoPintura: "" });

  useEffect(() => {
    if (modoEdicion && tipoEditar) {
      setForm({ NombreTipoPintura: tipoEditar.NombreTipoPintura });
    } else {
      setForm({ NombreTipoPintura: "" });
    }
  }, [modoEdicion, tipoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token no encontrado. El usuario no está autenticado.");
      return;
    }

    const payload = {
      metadata: {
        uri: "/pintura/POST/tipopinturas",
      },
      request: {
        NombreTipoPintura: form.NombreTipoPintura,
      },
    };

    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ← Token en encabezado
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Tipo de pintura agregado", data);
        toggle();
        setForm({ NombreTipoPintura: "" });
        if (onSubmit) onSubmit(); // si se desea refrescar la lista después
      } else {
        const errorData = await response.json();
        console.error("Error al agregar tipo de pintura:", errorData);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {modoEdicion ? "Editar Tipo de Pintura" : "Agregar Tipo de Pintura"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Nombre del Tipo de Pintura</Label>
            <Input
              type="text"
              name="NombreTipoPintura"
              value={form.NombreTipoPintura}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {modoEdicion ? "Guardar Cambios" : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarTipoPintura;
