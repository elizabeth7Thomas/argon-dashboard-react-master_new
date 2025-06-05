// src/components/CategoriasMantenimiento.jsx

import React, { useState, useEffect } from "react";
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

import apiClient from "./apiClient"; // <-- Importar el broker (mismo nivel)

const CategoriasMantenimiento = () => {
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    status: 1,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  // Al montar el componente, traemos todas las categorías
  useEffect(() => {
    obtenerTodasLasCategorias();
  }, []);

  // 1) Listar todas las categorías
  const obtenerTodasLasCategorias = async () => {
    try {
      const response = await apiClient.post("", {
        metadata: { uri: "/tallerrepuestos/GET/categorias" },
        request: {},
      });

      if (response.data?.response?.data) {
        setCategorias(response.data.response.data);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Abre/cierra el modal y resetea el formulario si se abre para agregar
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

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // 2) Agregar nueva categoría
  const handleAgregar = async () => {
    if (!formulario.nombre.trim()) {
      return;
    }

    try {
      const nueva = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        status: parseInt(formulario.status, 10),
      };

      await apiClient.post("", {
        metadata: { uri: "/tallerrepuestos/POST/categorias" },
        request: nueva,
      });

      await obtenerTodasLasCategorias();
      toggle();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  // 3) Preparar edición: cargar datos en el formulario y abrir modal en modo edición
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

  // 4) Actualizar categoría existente
  const handleActualizar = async () => {
    if (!categoriaEditando) return;

    try {
      const actualizado = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        status: parseInt(formulario.status, 10),
      };

      await apiClient.post("", {
        metadata: {
          uri: `/tallerrepuestos/PUT/categorias/${categoriaEditando.idcategoria}`,
        },
        request: actualizado,
      });

      await obtenerTodasLasCategorias();
      toggle();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  // 5) Solicitar borrado: abrir modal de confirmación
  const solicitarBorrado = (categoria) => {
    setCategoriaAEliminar(categoria);
    setShowDeleteModal(true);
  };

  // 6) Confirmar y borrar categoría
  const confirmarBorrado = async () => {
    if (!categoriaAEliminar) return;

    try {
      await apiClient.post("", {
        metadata: {
          uri: `/tallerrepuestos/DELETE/categorias/${categoriaAEliminar.idcategoria}`,
        },
        request: {},
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
            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
              <Col className="align-items-center">
                <h3 className="mb-0">Lista de Categorías</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
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
                          <Button
                            size="sm"
                            color="info"
                            className="me-2"
                            onClick={() => handleEditarClick(c)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => solicitarBorrado(c)}
                          >
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

      {/* Modal para agregar/editar categoría */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Categoría" : "Agregar Categoría"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
              />
            </FormGroup>
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

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={showDeleteModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          {categoriaAEliminar && (
            <>
              <p>
                Estás a punto de eliminar la categoría con los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Nombre:</strong> {categoriaAEliminar.nombre}
                </li>
                <li>
                  <strong>Descripción:</strong> {categoriaAEliminar.descripcion}
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

export default CategoriasMantenimiento;
