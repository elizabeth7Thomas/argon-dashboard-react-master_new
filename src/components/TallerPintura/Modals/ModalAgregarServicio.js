// ModalAgregarServicio.js
import React, { useEffect,useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Form } from "reactstrap";

const ModalAgregarServicio = ({ isOpen, toggle, onSubmit,modoEdicion=false,tipoEditar=null }) => {
  const [form, setForm] = useState({
    NombreServicio: "",
    DescripcionServicio: ""
  });

  useEffect(() => {
    if (modoEdicion && tipoEditar) {
      setForm({
        NombreServicio: tipoEditar.NombreServicio,
        DescripcionServicio: tipoEditar.DescripcionServicio
      });
    } else {
      setForm({
        NombreServicio: "",
        DescripcionServicio: ""
      });
    }
  }, [modoEdicion, tipoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = () => {
    // Crear un nuevo servicio con los datos del formulario
    const nuevoServicio = {
      idServicio: Math.random(), // Generar un id aleatorio para fines de demostración
      NombreServicio: form.NombreServicio,
      DescripcionServicio: form.DescripcionServicio
    };
    
    onSubmit(nuevoServicio); // Pasar el nuevo servicio al componente padre
    setForm({ NombreServicio: "", DescripcionServicio: "" }); // Limpiar formulario
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
        <Button color="primary" onClick={handleSubmit}>Agregar</Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarServicio;
