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

    const uri = modoEdicion
      ? `/pintura/PUT/tipopinturas/${tipoEditar.idTipoPintura}`
      : "/pintura/POST/tipopinturas";

    const payload = {
      metadata: {
        uri,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Tipo de pintura procesado:", data);

        onSubmit({
          NombreTipoPintura: form.NombreTipoPintura,
          idTipoPintura: tipoEditar?.idTipoPintura || null,
        });

        toggle();
        setForm({ NombreTipoPintura: "" });
      } else {
        const errorData = await response.json();
        console.error("Error en la solicitud:", errorData);
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
            <Label for="NombreTipoPintura">Nombre del Tipo de Pintura</Label>
            <Input
              type="text"
              name="NombreTipoPintura"
              value={form.NombreTipoPintura}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
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

export default ModalAgregarTipoPintura;
