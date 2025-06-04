// src/components/TipoServicioMantenimiento.jsx

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

const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const TipoServicioMantenimiento = () => {
  const [tipos, setTipos] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    descripcion: "",
    costo: "",
    tiposervicio: "",
    status: 1,
  });


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoAEliminar, setTipoAEliminar] = useState(null);


  useEffect(() => {
    obtenerTodosLosTipos();
  }, []);

  const obtenerTodosLosTipos = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/tiposervicios`);
      setTipos(resp.data);
    } catch (error) {
      console.error("Error al obtener tipos de servicio:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormulario({
        descripcion: "",
        costo: "",
        tiposervicio: "",
        status: 1,
      });
      setModoEdicion(false);
      setTipoEditando(null);
    }
  };


  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    if (
      !formulario.descripcion.trim() ||
      !formulario.costo ||
      !formulario.tiposervicio.trim()
    ) {
      return;
    }

    try {
      const nuevo = {
        descripcion: formulario.descripcion.trim(),
        costo: parseFloat(formulario.costo),
        tiposervicio: formulario.tiposervicio.trim(),
        status: formulario.status,
      };

      await axios.post(`${BASE_URL}/tiposervicio`, nuevo);
      await obtenerTodosLosTipos();
      toggle();
    } catch (error) {
      console.error("Error al crear tipo de servicio:", error);
    }
  };


  const handleEditarClick = (tipo) => {
    setFormulario({
      descripcion: tipo.descripcion,
      costo: tipo.costo.toString(),
      tiposervicio: tipo.tiposervicio,
      status: tipo.status,
    });
    setModoEdicion(true);
    setTipoEditando(tipo);
    setModal(true);
  };

  const handleActualizar = async () => {
    if (!tipoEditando) return;

    try {
      const actualizado = {
        descripcion: formulario.descripcion.trim(),
        costo: parseFloat(formulario.costo),
        tiposervicio: formulario.tiposervicio.trim(),
        status: formulario.status,
      };

      await axios.put(
        `${BASE_URL}/tiposervicio/${tipoEditando.idtiposervicio}`,
        actualizado
      );
      await obtenerTodosLosTipos();
      toggle();
    } catch (error) {
      console.error("Error al actualizar tipo de servicio:", error);
    }
  };

  const solicitarBorrado = (tipo) => {
    setTipoAEliminar(tipo);
    setShowDeleteModal(true);
  };

  const confirmarBorrado = async () => {
    if (!tipoAEliminar) return;

    try {
      await axios.delete(
        `${BASE_URL}/tiposervicio/${tipoAEliminar.idtiposervicio}`
      );
      await obtenerTodosLosTipos();
      setShowDeleteModal(false);
      setTipoAEliminar(null);
    } catch (error) {
      console.error("Error al borrar tipo de servicio:", error);
    }
  };

  const cancelarBorrado = () => {
    setShowDeleteModal(false);
    setTipoAEliminar(null);
  };

  return (
    <>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Lista de Tipos de Servicio</h3>
                <Button color="primary" onClick={toggle}>
                  Agregar Tipo de Servicio
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive hover className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th>Descripción</th>
                      <th>Costo</th>
                      <th>Tipo Servicio</th>
                      <th>Status</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tipos.length > 0 ? (
                      tipos.map((t) => (
                        <tr key={t.idtiposervicio}>
                          <td>{t.descripcion}</td>
                          <td>{t.costo}</td>
                          <td>{t.tiposervicio}</td>
                          <td>{t.status === 1 ? "Activo" : "Inactivo"}</td>
                          <td>
                            <Button
                              size="sm"
                              color="info"
                              className="me-2"
                              onClick={() => handleEditarClick(t)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-0" />
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => solicitarBorrado(t)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} className="mr-0" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No hay tipos de servicio disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

      {/* Modal Agregar / Editar Tipo de Servicio */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Tipo de Servicio" : "Agregar Tipo de Servicio"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Descripción</Label>
              <Input
                type="text"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Costo</Label>
              <Input
                type="number"
                step="0.01"
                name="costo"
                value={formulario.costo}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Tipo Servicio</Label>
              <Input
                type="text"
                name="tiposervicio"
                value={formulario.tiposervicio}
                onChange={handleChange}
              />
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
          {tipoAEliminar && (
            <>
              <p>
                Estás a punto de eliminar el tipo de servicio con los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Descripción:</strong> {tipoAEliminar.descripcion}
                </li>
                <li>
                  <strong>Tipo:</strong> {tipoAEliminar.tiposervicio}
                </li>
                <li>
                  <strong>Costo:</strong> {tipoAEliminar.costo}
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

export default TipoServicioMantenimiento;
