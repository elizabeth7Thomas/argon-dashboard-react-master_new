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

const ModalAgregarTipoVehiculo = ({ isOpen, toggle, onSubmit, modoEdicion = false, tipoEditar = null }) => {
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
   const nuevoVehiculo = {
    NombreTipoVehiculo: form.NombreTipoVehiculo
   };

   try{
    const response = await fetch("http://127.0.0.1:8000/pintura/POST/tipovehiculos",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoVehiculo),
    });

    if(response.ok){
      const data = await response.json();
      console.log("Nuevo tipo de vehiculo agregado", data);
      toggle();
      setForm({NombreTipoVehiculo: ""});

    }else{
        const errorData = await response.json();
        console.error("Error al crear:", errorData);
    }
   }catch (error) {
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
