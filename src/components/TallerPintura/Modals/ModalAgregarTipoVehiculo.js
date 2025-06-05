import React, { useEffect, useState } from "react";
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

const ModalAgregarTipoVehiculo = ({
  isOpen,
  toggle,
  onSubmit,
  modoEdicion = false,
  tipoEditar = null,
}) => {
  const [form, setForm] = useState({ NombreTipoVehiculo: "" });

  useEffect(() => {
    if (modoEdicion && tipoEditar) {
      setForm({ NombreTipoVehiculo: tipoEditar.NombreTipoVehiculo });
    } else {
      setForm({ NombreTipoVehiculo: "" });
    }
  }, [modoEdicion, tipoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const uri = modoEdicion
      ? `/pintura/PUT/tipovehiculos/${tipoEditar.idTipoVehiculo}`
      : "/pintura/POST/tipovehiculos";

    const payload = {
      metadata: {
        uri,
      },
      request: {
        NombreTipoVehiculo: form.NombreTipoVehiculo,
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
        console.log("Tipo de vehículo procesado:", data);

        onSubmit({
          NombreTipoVehiculo: form.NombreTipoVehiculo,
          idTipoVehiculo: tipoEditar?.idTipoVehiculo || null,
        });

        toggle();
        setForm({ NombreTipoVehiculo: "" });
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
        {modoEdicion ? "Editar Tipo de Vehículo" : "Agregar Tipo de Vehículo"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreTipoVehiculo">Nombre del Tipo de Vehículo</Label>
            <Input
              type="text"
              name="NombreTipoVehiculo"
              value={form.NombreTipoVehiculo}
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

export default ModalAgregarTipoVehiculo;
