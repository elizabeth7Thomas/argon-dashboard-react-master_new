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

const ModalAgregarVenta = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    Fecha: "",
    idCliente: "",
    idColor: "",
    idTipoServicio: "",
  });

  const [clientes, setClientes] = useState([]);
  const [colores, setColores] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);

  const obtenerDatos = async () => {
    const resClientes = await fetch("http://localhost:8000/pintura/GET/clientes");
    const resColores = await fetch("http://localhost:8000/pintura/GET/colores");
    const resTiposServicio = await fetch("http://localhost:8000/pintura/GET/tiposservicio");

    setClientes(await resClientes.json());
    setColores(await resColores.json());
    setTiposServicio(await resTiposServicio.json());
  };

  useEffect(() => {
    if (isOpen) obtenerDatos();
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ Fecha: "", idCliente: "", idColor: "", idTipoServicio: "" });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Venta</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="Fecha">Fecha</Label>
            <Input
              type="date"
              name="Fecha"
              value={form.Fecha}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="idCliente">Cliente</Label>
            <Input
              type="select"
              name="idCliente"
              value={form.idCliente}
              onChange={handleChange}
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.NombreCliente}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="idColor">Color</Label>
            <Input
              type="select"
              name="idColor"
              value={form.idColor}
              onChange={handleChange}
            >
              <option value="">Selecciona un color</option>
              {colores.map((color) => (
                <option key={color.idColor} value={color.idColor}>
                  {color.NombreColor}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="idTipoServicio">Tipo de Servicio</Label>
            <Input
              type="select"
              name="idTipoServicio"
              value={form.idTipoServicio}
              onChange={handleChange}
            >
              <option value="">Selecciona un tipo</option>
              {tiposServicio.map((tipo) => (
                <option key={tipo.idTipoServicio} value={tipo.idTipoServicio}>
                  {tipo.NombreTipoServicio}
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

export default ModalAgregarVenta;
