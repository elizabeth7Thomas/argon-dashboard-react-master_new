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
  faIdCard,
  faPhone,
  faEnvelope,
  faBriefcase,
  faDollarSign,
  faTrashAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
        <Container fluid>
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">
                <FontAwesomeIcon icon={faUsers} className="mr-2" /> Gestión de Empleados
              </h2>
              <p className="text-white mb-0">Administra los empleados del taller</p>
            </Col>
            <Col lg="6" className="text-right">
              <Button
                color="neutral"
                onClick={() => { limpiarFormulario(); setModoEditar(false); }}
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Nuevo Empleado
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        {/* Formulario */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3>{modoEditar ? "Editar Empleado" : "Registrar Nuevo Empleado"}</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="idEmpleado">ID Empleado</Label>
                      <Input
                        id="idEmpleado"
                        name="idEmpleado"
                        value={form.idEmpleado}
                        disabled
                        className="mb-3"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={form.telefono}
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
                        value={form.apellido}
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
                        value={form.email}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        name="cargo"
                        value={form.cargo}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="salario">Salario</Label>
                      <Input
                        id="salario"
                        name="salario"
                        type="number"
                        value={form.salario}
                        onChange={handleChange}
                        className="mb-3"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-right">
                  {modoEditar ? (
                    <>
                      <Button color="warning" onClick={actualizarEmpleado} className="mr-2">
                        <FontAwesomeIcon icon={faEdit} className="mr-1" /> Actualizar Empleado
                      </Button>
                      <Button color="secondary" onClick={() => { limpiarFormulario(); setModoEditar(false); }}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button color="primary" onClick={agregarEmpleado}>
                      <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Agregar Empleado
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Tabla */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3>Listado de Empleados</h3>
                  </Col>
                  <Col className="text-right">
                    <Input
                      type="text"
                      placeholder="Buscar empleado..."
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      style={{ maxWidth: "300px" }}
                    />
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
                            <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
                          </Button>
                          <Button size="sm" color="danger" onClick={() => solicitarBorrado(emp)}>
                            <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Eliminar
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
