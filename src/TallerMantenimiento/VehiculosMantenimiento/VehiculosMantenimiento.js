import React, { useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const VehiculosMantenimiento = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    placa: "",
    marca: "",
    modelo: "",
    fecha: "",
    tipoVehiculo: "",
    idCliente: "",
  });

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormulario({
        placa: "",
        marca: "",
        modelo: "",
        fecha: "",
        tipoVehiculo: "",
        idCliente: "",
      });
      setModoEdicion(false);
      setVehiculoEditando(null);
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    const nuevoVehiculo = {
      idVehiculo: Date.now(),
      ...formulario,
      idCliente: parseInt(formulario.idCliente),
    };

    setVehiculos([...vehiculos, nuevoVehiculo]);
    toggle();
  };

  const handleEditarClick = (vehiculo) => {
    setFormulario({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      fecha: vehiculo.fecha,
      tipoVehiculo: vehiculo.tipoVehiculo,
      idCliente: vehiculo.idCliente.toString(),
    });
    setModoEdicion(true);
    setVehiculoEditando(vehiculo);
    setModal(true);
  };

  const handleActualizar = () => {
    const actualizados = vehiculos.map((v) =>
      v.idVehiculo === vehiculoEditando.idVehiculo
        ? { ...v, ...formulario, idCliente: parseInt(formulario.idCliente) }
        : v
    );
    setVehiculos(actualizados);
    toggle();
  };

  const handleEliminar = (id) => {
    setVehiculos(vehiculos.filter((v) => v.idVehiculo !== id));
  };

  return (
    <>
   
      
      <Container className="mt-4" fluid>
        <Row>
          <Col>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3>Lista de Vehículos</h3>
                <Button color="primary" onClick={toggle}>
                  Agregar Vehículo
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>ID Cliente</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculos.map((vehiculo) => (
                      <tr key={vehiculo.idVehiculo}>
                        <td>{vehiculo.placa}</td>
                        <td>{vehiculo.marca}</td>
                        <td>{vehiculo.modelo}</td>
                        <td>{vehiculo.fecha}</td>
                        <td>{vehiculo.tipoVehiculo}</td>
                        <td>{vehiculo.idCliente}</td>
                        <td>
                          <Button
                            size="sm"
                            color="warning"
                            className="me-2"
                            onClick={() => handleEditarClick(vehiculo)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => handleEliminar(vehiculo.idVehiculo)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {vehiculos.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No hay vehículos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para Agregar / Editar Vehículo */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Vehículo" : "Agregar Vehículo"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Placa</Label>
              <Input
                type="text"
                name="placa"
                value={formulario.placa}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Marca</Label>
              <Input
                type="text"
                name="marca"
                value={formulario.marca}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Modelo</Label>
              <Input
                type="text"
                name="modelo"
                value={formulario.modelo}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Fecha</Label>
              <Input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Tipo de Vehículo</Label>
              <Input
                type="text"
                name="tipoVehiculo"
                value={formulario.tipoVehiculo}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>ID Cliente</Label>
              <Input
                type="number"
                name="idCliente"
                value={formulario.idCliente}
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {modoEdicion ? (
            <Button color="success" onClick={handleActualizar}>
              Actualizar
            </Button>
          ) : (
            <Button color="primary" onClick={handleAgregar}>
              Agregar
            </Button>
          )}
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VehiculosMantenimiento;
