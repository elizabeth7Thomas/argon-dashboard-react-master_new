import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Ajusta esta URL según tu despliegue
const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const ServiciosMantenimiento = () => {
  const [servicios, setServicios] = useState([]);
  const [tiposList, setTiposList] = useState([]);
  const [empleadosList, setEmpleadosList] = useState([]);
  const [busquedaTipo, setBusquedaTipo] = useState("");
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    tipovehiculo: "",
    idtiposervicio: "",
    idempleado: "",
    status: 1,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);

  // 1) Al montar, obtenemos servicios, tipos y empleados
  useEffect(() => {
    obtenerTodosLosServicios();
    obtenerTodosLosTipos();
    obtenerTodosLosEmpleados();
  }, []);

  const obtenerTodosLosServicios = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/servicios`);
      setServicios(resp.data);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    }
  };

  const obtenerTodosLosTipos = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/tiposervicios`);
      const activos = resp.data.filter((t) => t.status === 1);
      setTiposList(
        activos.map((t) => ({ id: t.idtiposervicio, nombre: t.tiposervicio }))
      );
    } catch (error) {
      console.error("Error al obtener tipos de servicio:", error);
    }
  };

  const obtenerTodosLosEmpleados = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/empleados`);
      const activos = resp.data.filter((e) => e.status === 1);
      setEmpleadosList(
        activos.map((e) => ({ id: e.idempleado, nombre: `${e.nombre} ${e.apellido}` }))
      );
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  // Filtrados
  const tiposFiltrados = tiposList.filter((t) =>
    t.nombre.toLowerCase().includes(busquedaTipo.toLowerCase())
  );
  const empleadosFiltrados = empleadosList.filter((e) =>
    e.nombre.toLowerCase().includes(busquedaEmpleado.toLowerCase())
  );

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormulario({ tipovehiculo: "", idtiposervicio: "", idempleado: "", status: 1 });
      setModoEdicion(false);
      setServicioEditando(null);
      setBusquedaTipo("");
      setBusquedaEmpleado("");
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    if (
      !formulario.tipovehiculo.trim() ||
      !formulario.idtiposervicio ||
      !formulario.idempleado
    ) return;
    try {
      const nuevo = {
        tipovehiculo: formulario.tipovehiculo.trim(),
        idtiposervicio: parseInt(formulario.idtiposervicio, 10),
        idempleado: parseInt(formulario.idempleado, 10),
        status: formulario.status,
      };
      await axios.post(`${BASE_URL}/servicios`, nuevo);
      await obtenerTodosLosServicios();
      toggle();
    } catch (error) {
      console.error("Error al crear servicio:", error);
    }
  };

  const handleEditarClick = (servicio) => {
    setFormulario({
      tipovehiculo: servicio.tipovehiculo,
      idtiposervicio: servicio.idtiposervicio.toString(),
      idempleado: servicio.idempleado.toString(),
      status: servicio.status,
    });
    setModoEdicion(true);
    setServicioEditando(servicio);
    const tipoNombre = tiposList.find((t) => t.id === servicio.idtiposervicio)?.nombre || "";
    const empleadoNombre = empleadosList.find((e) => e.id === servicio.idempleado)?.nombre || "";
    setBusquedaTipo(tipoNombre);
    setBusquedaEmpleado(empleadoNombre);
    setModal(true);
  };

  const handleActualizar = async () => {
    if (!servicioEditando) return;
    try {
      const actualizado = {
        tipovehiculo: formulario.tipovehiculo.trim(),
        idtiposervicio: parseInt(formulario.idtiposervicio, 10),
        idempleado: parseInt(formulario.idempleado, 10),
        status: formulario.status,
      };
      await axios.put(
        `${BASE_URL}/servicios/${servicioEditando.idservicio}`,
        actualizado
      );
      await obtenerTodosLosServicios();
      toggle();
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
    }
  };

  const solicitarBorrado = (servicio) => {
    setServicioAEliminar(servicio);
    setShowDeleteModal(true);
  };

  const confirmarBorrado = async () => {
    if (!servicioAEliminar) return;
    try {
      await axios.delete(
        `${BASE_URL}/servicios/${servicioAEliminar.idservicio}`
      );
      await obtenerTodosLosServicios();
      setShowDeleteModal(false);
      setServicioAEliminar(null);
    } catch (error) {
      console.error("Error al borrar servicio:", error);
    }
  };

  const cancelarBorrado = () => {
    setShowDeleteModal(false);
    setServicioAEliminar(null);
  };

  return (
    <>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Lista de Servicios</h3>
                <Button color="primary" onClick={toggle}>
                  Agregar Servicio
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive hover className="align-items-center table-flush">
                  <thead  className="thead-light">
                    <tr>
                      <th>Tipo Vehículo</th>
                      <th>Tipo de Servicio</th>
                      <th>Empleado</th>
                      <th>Status</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicios.length > 0 ? (
                      servicios.map((s) => {
                        const tipo = tiposList.find((t) => t.id === s.idtiposervicio);
                        const empleado = empleadosList.find((e) => e.id === s.idempleado);
                        return (
                          <tr key={s.idservicio}>
                            <td>{s.tipovehiculo}</td>
                            <td>{tipo?.nombre || "N/A"}</td>
                            <td>{empleado?.nombre || s.idempleado}</td>
                            <td>{s.status === 1 ? "Activo" : "Inactivo"}</td>
                            <td>
                              <Button size="sm" color="info" className="me-2" onClick={() => handleEditarClick(s)}>
                                <FontAwesomeIcon icon={faEdit} className="mr-0" />
                              </Button>
                              <Button size="sm" color="danger" onClick={() => solicitarBorrado(s)}>
                                <FontAwesomeIcon icon={faTrashAlt} className="mr-0" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No hay servicios disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

      {/* Modal Agregar / Editar Servicio */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Servicio" : "Agregar Servicio"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Tipo Vehículo</Label>
              <Input
                type="text"
                name="tipovehiculo"
                value={formulario.tipovehiculo}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Buscar y seleccionar Tipo de Servicio */}
            <FormGroup>
              <Label>Buscar Tipo de Servicio</Label>
              <Input
                type="text"
                placeholder="Escribe nombre de tipo..."
                value={busquedaTipo}
                onChange={(e) => setBusquedaTipo(e.target.value)}
                className="mb-2"
              />
              <Input
                type="select"
                name="idtiposervicio"
                value={formulario.idtiposervicio}
                onChange={handleChange}
              >
                <option value="">-- Selecciona un tipo de servicio --</option>
                {tiposFiltrados.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>

            {/* Buscar y seleccionar Empleado */}
            <FormGroup>
              <Label>Buscar Empleado</Label>
              <Input
                type="text"
                placeholder="Escribe nombre de empleado..."
                value={busquedaEmpleado}
                onChange={(e) => setBusquedaEmpleado(e.target.value)}
                className="mb-2"
              />
              <Input
                type="select"
                name="idempleado"
                value={formulario.idempleado}
                onChange={handleChange}
              >
                <option value="">-- Selecciona un empleado --</option>
                {empleadosFiltrados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Input
                type="select"
                name="status"
                value={formulario.status}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Input>
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

      {/* Modal de Confirmación de Borrado */}
      <Modal isOpen={showDeleteModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          {servicioAEliminar && (
            <>
              <p>
                Estás a punto de eliminar el servicio con los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Tipo Vehículo:</strong> {servicioAEliminar.tipovehiculo}
                </li>
                <li>
                  <strong>Tipo de Servicio:</strong>{" "}
                  {
                    tiposList.find((t) => t.id === servicioAEliminar.idtiposervicio)
                      ?.nombre
                  }
                </li>
                <li>
                  <strong>Empleado (ID):</strong> {servicioAEliminar.idempleado}
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

export default ServiciosMantenimiento;
