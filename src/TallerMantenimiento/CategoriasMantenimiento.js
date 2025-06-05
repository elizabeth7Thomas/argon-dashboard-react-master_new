// src/components/CategoriasMantenimiento.jsx

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
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BROKER_URL = "http://64.23.169.22:3761/broker/api/rest";

const CategoriasMantenimiento = () => {
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    status: 1,
  });

  useEffect(() => {
    obtenerTodasLasCategorias();
  }, []);

  const obtenerTodasLasCategorias = async () => {
    try {
      const { data } = await axios.post(BROKER_URL, {
        metadata: {
          uri: "tallerrepuestos/categorias",
        },
        request: {},
      });
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormulario({
        nombre: "",
        descripcion: "",
        status: 1,
      });
      setModoEdicion(false);
      setCategoriaEditando(null);
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    if (!formulario.nombre.trim()) return;

    try {
      await axios.post(BROKER_URL, {
        metadata: {
          uri: "tallerrepuestos/categorias",
        },
        request: {
          ...formulario,
          status: Number(formulario.status),
        },
      });
      await obtenerTodasLasCategorias();
      toggle();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const handleEditarClick = (categoria) => {
    setFormulario({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      status: categoria.status,
    });
    setModoEdicion(true);
    setCategoriaEditando(categoria);
    setModal(true);
  };

  const handleActualizar = async () => {
    if (!categoriaEditando) return;

    try {
      await axios.post(BROKER_URL, {
        metadata: {
          uri: `tallerrepuestos/categorias/${categoriaEditando.idcategoria}`,
        },
        request: {
          ...formulario,
          status: Number(formulario.status),
        },
      });
      await obtenerTodasLasCategorias();
      toggle();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const solicitarBorrado = (categoria) => {
    setCategoriaAEliminar(categoria);
    setShowDeleteModal(true);
  };

  const confirmarBorrado = async () => {
    if (!categoriaAEliminar) return;

    try {
      await axios.post(BROKER_URL, {
        metadata: {
          uri: `tallerrepuestos/categorias/${categoriaAEliminar.idcategoria}`,
        },
        request: {
          status: 0,
        },
      });
      await obtenerTodasLasCategorias();
      setShowDeleteModal(false);
      setCategoriaAEliminar(null);
    } catch (error) {
      console.error("Error al borrar categoría:", error);
    }
  };

  const cancelarBorrado = () => {
    setShowDeleteModal(false);
    setCategoriaAEliminar(null);
  };

  return (
    <>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <Col>
                <h3 className="mb-0">Lista de Categorías</h3>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button color="primary" onClick={toggle}>
                  Agregar Categoría
                </Button>
              </Col>
            </CardHeader>
            <CardBody>
              <Table className="align-items-center table-flush" responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Status</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.length > 0 ? (
                    categorias.map((c) => (
                      <tr key={c.idcategoria}>
                        <td>{c.nombre}</td>
                        <td>{c.descripcion}</td>
                        <td>{c.status === 1 ? "Activo" : "Inactivo"}</td>
                        <td>
                          <Button size="sm" color="info" className="me-2" onClick={() => handleEditarClick(c)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button size="sm" color="danger" onClick={() => solicitarBorrado(c)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No hay categorías disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal Agregar/Editar */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Categoría" : "Agregar Categoría"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <Input type="text" name="descripcion" value={formulario.descripcion} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Input type="select" name="status" value={formulario.status} onChange={handleChange}>
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color={modoEdicion ? "success" : "primary"} onClick={modoEdicion ? handleActualizar : handleAgregar}>
            {modoEdicion ? "Actualizar" : "Agregar"}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={showDeleteModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>Confirmar eliminación</ModalHeader>
        <ModalBody>
          {categoriaAEliminar && (
            <>
              <p>Estás a punto de eliminar la categoría:</p>
              <ul>
                <li><strong>Nombre:</strong> {categoriaAEliminar.nombre}</li>
                <li><strong>Descripción:</strong> {categoriaAEliminar.descripcion}</li>
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

export default CategoriasMantenimiento;
