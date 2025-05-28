import React, { useState, useEffect } from "react";
import axios from "axios";
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
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  faUserPlus,
  faEdit,
  faUsers,
  faIdCard,
  faPhone,
  faEnvelope,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    idCliente: "",
    nombre: "",
    apellido: "",
    nit: "",
    telefono: "",
    email: "",
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Estados para el modal de confirmación de borrado
  const [showModal, setShowModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  // 1) Al montar el componente, obtenemos todos los clientes desde el backend:
  useEffect(() => {
    obtenerTodosLosClientes();
  }, []);

  const obtenerTodosLosClientes = async () => {
    try {
      const respuesta = await axios.get(`${BASE_URL}/clientes`);
      // La API retorna objetos con campo `idcliente`. Mapeamos a nuestro estado:
      const clientesMapeados = respuesta.data.map((c) => ({
        idCliente: c.idcliente.toString(),
        nombre: c.nombre,
        apellido: c.apellido,
        nit: c.nit || "",
        telefono: c.telefono,
        email: c.email,
        status: c.status,
      }));
      setClientes(clientesMapeados);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Manejador para actualizar el formulario:
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2) Agregar Cliente → POST /clientes
  const agregarCliente = async () => {
    // Validaciones mínimas:
    if (!form.nombre.trim() || !form.apellido.trim()) return;

    try {
      const nuevo = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        nit: form.nit.trim() ? form.nit.trim() : null,
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        status: 1,
      };

      await axios.post(`${BASE_URL}/clientes`, nuevo);
      // Recargamos la lista completa
      await obtenerTodosLosClientes();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  // 3) Editar Cliente → carga el formulario en modo edición
  const editar = (cliente) => {
    setForm({
      idCliente: cliente.idCliente,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      nit: cliente.nit,
      telefono: cliente.telefono,
      email: cliente.email,
    });
    setModoEditar(true);
  };

  // 4) Actualizar Cliente → PUT /clientes/:id
  const actualizarCliente = async () => {
    if (!form.idCliente) return;

    try {
      const actualizado = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        nit: form.nit.trim() ? form.nit.trim() : null,
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        status: 1, // Mantener activo
      };

      await axios.put(`${BASE_URL}/clientes/${form.idCliente}`, actualizado);
      // Recargamos la lista completa
      await obtenerTodosLosClientes();
      limpiarFormulario();
      setModoEditar(false);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  // 5A) Mostrar modal de confirmación antes de eliminar
  const solicitarBorrado = (cliente) => {
    setClienteAEliminar(cliente);
    setShowModal(true);
  };

  // 5B) Confirmar y ejecutar borrado → DELETE /clientes/:id
  const confirmarBorrado = async () => {
    if (!clienteAEliminar) return;

    try {
      await axios.delete(`${BASE_URL}/clientes/${clienteAEliminar.idCliente}`);
      // Recargamos la lista completa
      await obtenerTodosLosClientes();
      setShowModal(false);
      setClienteAEliminar(null);
    } catch (error) {
      console.error("Error al borrar cliente:", error);
    }
  };

  const cancelarBorrado = () => {
    setShowModal(false);
    setClienteAEliminar(null);
  };

  const limpiarFormulario = () => {
    setForm({
      idCliente: "",
      nombre: "",
      apellido: "",
      nit: "",
      telefono: "",
      email: "",
    });
  };

  // Filtrado en tiempo real:
  const clientesFiltrados = clientes.filter(
    (cliente) =>
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
                <Button
                  color="neutral"
                  onClick={() => {
                    limpiarFormulario();
                    setModoEditar(false);
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                  Nuevo Cliente
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        {/* FORMULARIO */}
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
                    {/* ID Cliente (solo lectura) */}
                    <FormGroup>
                      <Label for="idCliente">ID Cliente</Label>
                      <Input
                        id="idCliente"
                        name="idCliente"
                        placeholder="Se asigna automáticamente"
                        value={form.idCliente}
                        disabled
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
                    <FormGroup>
                      <Label for="nit">NIT</Label>
                      <Input
                        id="nit"
                        name="nit"
                        placeholder="Documento tributario (opcional)"
                        value={form.nit}
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
                      <Button
                        color="warning"
                        onClick={actualizarCliente}
                        className="mr-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        Actualizar Cliente
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          limpiarFormulario();
                          setModoEditar(false);
                        }}
                      >
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

        {/* TABLA DE CLIENTES */}
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
                    <th>
                      <FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID
                    </th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>NIT</th>
                    <th>
                      <FontAwesomeIcon icon={faPhone} className="mr-1" /> Teléfono
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faEnvelope} className="mr-1" /> Email
                    </th>
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
                        <td>{cli.nit}</td>
                        <td>{cli.telefono}</td>
                        <td>{cli.email}</td>
                        <td>
                          <Button
                            size="sm"
                            color="info"
                            onClick={() => editar(cli)}
                            className="mr-2"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => solicitarBorrado(cli)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
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

      {/* Modal de Confirmación de Borrado */}
      <Modal isOpen={showModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          {clienteAEliminar && (
            <>
              <p>
                Estás a punto de eliminar al cliente con los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Nombre:</strong> {clienteAEliminar.nombre}
                </li>
                <li>
                  <strong>Apellido:</strong> {clienteAEliminar.apellido}
                </li>
                <li>
                  <strong>Email:</strong> {clienteAEliminar.email}
                </li>
              </ul>
              <p>¿Deseas continuar?</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmarBorrado}>
            Sí, eliminar
          </Button>
          <Button color="secondary" onClick={cancelarBorrado}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Clientes;
