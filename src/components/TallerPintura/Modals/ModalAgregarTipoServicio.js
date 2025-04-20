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

const ModalAgregarTipoServicio = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    NombreTipo: "",
    PrecioBase: "",
    idServicio: ""
  });

  const [servicios, setServicios] = useState([]);

  const obtenerServicios = async () => {
    const res = await fetch("http://localhost:8000/pintura/GET/servicios");
    const data = await res.json();
    setServicios(data);
  };

  useEffect(() => {
    if (isOpen) obtenerServicios();
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ NombreTipo: "", PrecioBase: "", idServicio: "" });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Tipo de Servicio</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreTipo">Nombre del Tipo</Label>
            <Input
              name="NombreTipo"
              value={form.NombreTipo}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="PrecioBase">Precio Base</Label>
            <Input
              type="number"
              name="PrecioBase"
              value={form.PrecioBase}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="idServicio">Servicio Relacionado</Label>
            <Input
              type="select"
              name="idServicio"
              value={form.idServicio}
              onChange={handleChange}
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.idServicio} value={s.idServicio}>
                  {s.NombreServicio}
                </option>
              ))}
            </Input>
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

export default ModalAgregarTipoServicio;
