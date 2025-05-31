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
  faBriefcase,
  faDollarSign,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NuevoEmpleadoForm from "./NuevoEmpleadoForm";

const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    idEmpleado: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    cargo: "",
    salario: "",
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 1) Obtener empleados
  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/empleados`);
      const map = resp.data.map(e => ({
        idEmpleado: e.idempleado.toString(),
        nombre: e.nombre,
        apellido: e.apellido,
        telefono: e.telefono,
        email: e.email,
        cargo: e.cargo,
        salario: e.salario,
        status: e.status,
      }));
      setEmpleados(map);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ idEmpleado: "", nombre: "", apellido: "", telefono: "", email: "", cargo: "", salario: "" });
  };

  // 2) Agregar
  const agregarEmpleado = async () => {
    if (!form.nombre.trim() || !form.apellido.trim()) return;
    try {
      await axios.post(`${BASE_URL}/empleados`, {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        cargo: form.cargo.trim(),
        salario: parseFloat(form.salario) || 0,
      });
      fetchEmpleados();
      limpiarFormulario();
    } catch (err) {
      console.error("Error al crear empleado:", err);
    }
  };

  // 3) Editar carga form
  const editar = (e) => {
    setForm({
      idEmpleado: e.idEmpleado,
      nombre: e.nombre,
      apellido: e.apellido,
      telefono: e.telefono,
      email: e.email,
      cargo: e.cargo,
      salario: e.salario.toString(),
    });
    setModoEditar(true);
    setMostrarFormulario(true);
  };

  // 4) Actualizar
  const actualizarEmpleado = async () => {
    if (!form.idEmpleado) return;
    try {
      await axios.put(`${BASE_URL}/empleados/${form.idEmpleado}`, {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        cargo: form.cargo.trim(),
        salario: parseFloat(form.salario) || 0,
      });
      fetchEmpleados();
      limpiarFormulario();
      setModoEditar(false);
    } catch (err) {
      console.error("Error al actualizar empleado:", err);
    }
  };

  // 5) Borrado
  const solicitarBorrado = (e) => {
    setEmpleadoAEliminar(e);
    setShowModal(true);
  };

  const confirmarBorrado = async () => {
    if (!empleadoAEliminar) return;
    try {
      await axios.delete(`${BASE_URL}/empleados/${empleadoAEliminar.idEmpleado}`);
      fetchEmpleados();
      setShowModal(false);
      setEmpleadoAEliminar(null);
    } catch (err) {
      console.error("Error al borrar empleado:", err);
    }
  };

  const cancelarBorrado = () => {
    setShowModal(false);
    setEmpleadoAEliminar(null);
  };

  // Filtrado
  const empleadosFiltrados = empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    emp.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    emp.idEmpleado.includes(busqueda)
  );

  return (
    <>
      <Container className="mt--0" fluid>
        {/* Modal para formulario de empleado */}
        <Modal isOpen={mostrarFormulario} toggle={() => setMostrarFormulario(false)}>
          <ModalHeader toggle={() => setMostrarFormulario(false)}>
            {modoEditar ? "Editar Empleado" : "Registrar Nuevo Empleado"}
          </ModalHeader>
          <ModalBody>
            <NuevoEmpleadoForm
              form={form}
              modoEditar={modoEditar}
              handleChange={handleChange}
              agregarEmpleado={async () => {
                await agregarEmpleado();
                setMostrarFormulario(false);
              }}
              actualizarEmpleado={async () => {
                await actualizarEmpleado();
                setMostrarFormulario(false);
              }}
              limpiarFormulario={limpiarFormulario}
              setModoEditar={setModoEditar}
              onClose={() => setMostrarFormulario(false)}
            />
          </ModalBody>
        </Modal>

        {/* Tabla de empleados */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3>Listado de Empleados</h3>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center">
                    <Input
                      type="text"
                      placeholder="Buscar empleado..."
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      style={{ maxWidth: "300px", marginRight: "inline-block" }}
                    />
                    <Button
                      color="primary"
                      onClick={() => {
                        limpiarFormulario();
                        setModoEditar(false);
                        setMostrarFormulario(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Nuevo Empleado
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table responsive hover className="align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    <th><FontAwesomeIcon icon={faIdCard} /> ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th><FontAwesomeIcon icon={faPhone} /> Teléfono</th>
                    <th><FontAwesomeIcon icon={faEnvelope} /> Email</th>
                    <th><FontAwesomeIcon icon={faBriefcase} /> Cargo</th>
                    <th><FontAwesomeIcon icon={faDollarSign} /> Salario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleadosFiltrados.length > 0 ? (
                    empleadosFiltrados.map(emp => (
                      <tr key={emp.idEmpleado}>
                        <td>{emp.idEmpleado}</td>
                        <td>{emp.nombre}</td>
                        <td>{emp.apellido}</td>
                        <td>{emp.telefono}</td>
                        <td>{emp.email}</td>
                        <td>{emp.cargo}</td>
                        <td>{emp.salario}</td>
                        <td>
                          <Button size="sm" color="info" onClick={() => editar(emp)} className="mr-2">
                            <FontAwesomeIcon icon={faEdit} className="mr-0" />
                          </Button>
                          <Button size="sm" color="danger" onClick={() => solicitarBorrado(emp)}>
                            <FontAwesomeIcon icon={faTrashAlt} className="mr-0" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        No se encontraron empleados
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de confirmación */}
      <Modal isOpen={showModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>Confirmar eliminación</ModalHeader>
        <ModalBody>
          {empleadoAEliminar && (
            <>
              <p>Estás a punto de eliminar al empleado:</p>
              <ul>
                <li><strong>Nombre:</strong> {empleadoAEliminar.nombre}</li>
                <li><strong>Apellido:</strong> {empleadoAEliminar.apellido}</li>
                <li><strong>Cargo:</strong> {empleadoAEliminar.cargo}</li>
              </ul>
              <p>¿Deseas continuar?</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmarBorrado}>Sí, eliminar</Button>
          <Button color="secondary" onClick={cancelarBorrado}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Empleados;
