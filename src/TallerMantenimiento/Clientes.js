import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Table,
  Input,
  CardHeader,
  FormGroup,
  Label,
  CardBody
} from "reactstrap";
import { 
  faUserPlus, 
  faEdit, 
  faUsers,
  faIdCard,
  faPhone,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Clientes = () => {
  const [clientes, setClientes] = useState([
    {
      idCliente: "001",
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "1234567890",
      email: "juan@example.com",
    },
    {
      idCliente: "002",
      nombre: "Ana",
      apellido: "López",
      telefono: "9876543210",
      email: "ana@example.com",
    },
  ]);

  const [form, setForm] = useState({
    idCliente: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });

  const [modoEditar, setModoEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarCliente = () => {
    if (!form.idCliente || !form.nombre) return;
    setClientes([...clientes, form]);
    setForm({ idCliente: "", nombre: "", apellido: "", telefono: "", email: "" });
  };

  const actualizarCliente = () => {
    setClientes(clientes.map((cli) =>
      cli.idCliente === form.idCliente ? form : cli
    ));
    setForm({ idCliente: "", nombre: "", apellido: "", telefono: "", email: "" });
    setModoEditar(false);
  };

  const editar = (cliente) => {
    setForm(cliente);
    setModoEditar(true);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.idCliente.includes(busqueda)
  );

  return (
    <>
      {/* Header personalizado para Clientes */}
      <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h2 className="text-white mb-0">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Gestión de Clientes
                </h2>
                <p className="text-white mb-0">
                  Administra los clientes del taller de mantenimiento
                </p>
              </Col>
              <Col lg="6" className="text-right">
                <Button color="neutral" onClick={() => setModoEditar(false)}>
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                  Nuevo Cliente
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">
                      {modoEditar ? "Editar Cliente" : "Registrar Nuevo Cliente"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="idCliente">ID Cliente</Label>
                      <Input
                        id="idCliente"
                        name="idCliente"
                        placeholder="Código único del cliente"
                        value={form.idCliente}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Nombre del cliente"
                        value={form.nombre}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        placeholder="Apellido del cliente"
                        value={form.apellido}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        placeholder="Número de contacto"
                        value={form.telefono}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-right">
                  {modoEditar ? (
                    <>
                      <Button color="warning" onClick={actualizarCliente} className="mr-2">
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        Actualizar Cliente
                      </Button>
                      <Button color="secondary" onClick={() => setModoEditar(false)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button color="primary" onClick={agregarCliente}>
                      <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                      Agregar Cliente
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Listado de Clientes</h3>
                  </Col>
                  <Col className="text-right">
                    <Input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      style={{ maxWidth: "300px" }}
                    />
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th><FontAwesomeIcon icon={faPhone} className="mr-1" /> Teléfono</th>
                    <th><FontAwesomeIcon icon={faEnvelope} className="mr-1" /> Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cli) => (
                      <tr key={cli.idCliente}>
                        <td>{cli.idCliente}</td>
                        <td>{cli.nombre}</td>
                        <td>{cli.apellido}</td>
                        <td>{cli.telefono}</td>
                        <td>{cli.email}</td>
                        <td>
                          <Button
                            size="sm"
                            color="info"
                            onClick={() => editar(cli)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No se encontraron clientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Clientes;