import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Input,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  faUserPlus,
  faEdit,

  faIdCard,
  faPhone,
  faEnvelope,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import NuevoClienteForm from "./NuevoClienteForm";

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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados para el modal de confirmación de borrado
  const [showModal, setShowModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  useEffect(() => {
    obtenerTodosLosClientes();
  }, []);

  const obtenerTodosLosClientes = async () => {
    try {
      const respuesta = await axios.get(`${BASE_URL}/clientes`);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarCliente = async () => {
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
      await obtenerTodosLosClientes();
      limpiarFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

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
    setMostrarFormulario(true);
  };

  const actualizarCliente = async () => {
    if (!form.idCliente) return;
    try {
      const actualizado = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        nit: form.nit.trim() ? form.nit.trim() : null,
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        status: 1,
      };
      await axios.put(`${BASE_URL}/clientes/${form.idCliente}`, actualizado);
      await obtenerTodosLosClientes();
      limpiarFormulario();
      setModoEditar(false);
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  const solicitarBorrado = (cliente) => {
    setClienteAEliminar(cliente);
    setShowModal(true);
  };

  const confirmarBorrado = async () => {
    if (!clienteAEliminar) return;
    try {
      await axios.delete(`${BASE_URL}/clientes/${clienteAEliminar.idCliente}`);
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

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.idCliente.includes(busqueda)
  );

  return (
    <>
        {/* Modal para formulario de cliente */}
        <Modal isOpen={mostrarFormulario} toggle={() => setMostrarFormulario(false)}>
          <ModalHeader toggle={() => setMostrarFormulario(false)}>
            {modoEditar ? "Editar Cliente" : "Registrar Nuevo Cliente"}
          </ModalHeader>
          <ModalBody>
            <NuevoClienteForm
              form={form}
              modoEditar={modoEditar}
              handleChange={handleChange}
              agregarCliente={async () => {
                await agregarCliente();
                setMostrarFormulario(false);
              }}
              actualizarCliente={async () => {
                await actualizarCliente();
                setMostrarFormulario(false);
              }}
              limpiarFormulario={limpiarFormulario}
              setModoEditar={setModoEditar}
              onClose={() => setMostrarFormulario(false)}
            />
          </ModalBody>
        </Modal>

        {/* Tabla de clientes */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Listado de Clientes</h3>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center">
                    <Input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      style={{ maxWidth: "300px", marginRight: "10px" }}
                    />
                    <Button
                      color="primary"
                      onClick={() => {
                        limpiarFormulario();
                        setModoEditar(false);
                        setMostrarFormulario(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                      Nuevo Cliente
                    </Button>
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
                            <FontAwesomeIcon icon={faEdit} className="mr-0" />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => solicitarBorrado(cli)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} className="mr-0" />
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
