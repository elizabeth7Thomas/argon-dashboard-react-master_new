// src/components/PrecioHistorial.js

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
  Label,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import apiClient from "./apiClient"; // <-- mismo nivel

const PrecioHistorial = () => {
  const [historial, setHistorial] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);

  const [form, setForm] = useState({
    idproducto: "",
    precioanterior: "",
    precionuevo: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);

  useEffect(() => {
    fetchHistorial();
    fetchProductos();
  }, []);

  // 1) Obtener historial de precios
  const fetchHistorial = async () => {
    try {
      const response = await apiClient.post("", {
        metadata: { uri: "/tallerrepuestos/GET/preciohistorial" },
        request: {},
      });
      if (response.data?.response?.data) {
        setHistorial(response.data.response.data);
      }
    } catch (err) {
      console.error("Error al obtener historial de precios:", err);
    }
  };

  // 2) Obtener lista de productos
  const fetchProductos = async () => {
    try {
      const response = await apiClient.post("", {
        metadata: { uri: "/tallerrepuestos/GET/productos" },
        request: {},
      });
      if (response.data?.response?.data) {
        setProductos(response.data.response.data);
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setForm({ idproducto: "", precioanterior: "", precionuevo: "" });
      setModoEdicion(false);
      setRegistroEditando(null);
      setBusquedaProducto("");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 3) Agregar nuevo registro
  const agregarRegistro = async () => {
    if (!form.idproducto || !form.precioanterior || !form.precionuevo) return;

    try {
      await apiClient.post("", {
        metadata: { uri: "/tallerrepuestos/POST/preciohistorial" },
        request: {
          idproducto: +form.idproducto,
          precioanterior: +form.precioanterior,
          precionuevo: +form.precionuevo,
        },
      });
      await fetchHistorial();
      toggle();
    } catch (err) {
      console.error("Error al crear registro de historial:", err);
    }
  };

  // 4) Cargar datos en el formulario para editar
  const editarClick = (reg) => {
    setForm({
      idproducto: reg.idproducto + "",
      precioanterior: reg.precioanterior,
      precionuevo: reg.precionuevo,
    });
    setModoEdicion(true);
    setRegistroEditando(reg);
    setModal(true);
    setBusquedaProducto("");
  };

  // 5) Actualizar registro existente
  const actualizarRegistro = async () => {
    if (!registroEditando) return;

    try {
      await apiClient.post("", {
        metadata: {
          uri: `/tallerrepuestos/PUT/preciohistorial/${registroEditando.idhistorial}`,
        },
        request: {
          idproducto: +form.idproducto,
          precioanterior: +form.precioanterior,
          precionuevo: +form.precionuevo,
        },
      });
      await fetchHistorial();
      toggle();
    } catch (err) {
      console.error("Error al actualizar registro de historial:", err);
    }
  };

  // 6) Solicitar borrado: abrir modal de confirmación
  const solicitarBorrado = (reg) => {
    setRegistroAEliminar(reg);
    setShowDeleteModal(true);
  };

  // 7) Confirmar y borrar registro
  const confirmarBorrado = async () => {
    if (!registroAEliminar) return;

    try {
      await apiClient.post("", {
        metadata: {
          uri: `/tallerrepuestos/DELETE/preciohistorial/${registroAEliminar.idhistorial}`,
        },
        request: {},
      });
      await fetchHistorial();
      setShowDeleteModal(false);
      setRegistroAEliminar(null);
    } catch (err) {
      console.error("Error al borrar registro de historial:", err);
    }
  };

  const cancelarBorrado = () => setShowDeleteModal(false);

  // Filtrar productos para el select
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  return (
    <>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
              <h3>Historial de Precios</h3>
              <Button color="primary" onClick={toggle}>
                Agregar Registro
              </Button>
            </CardHeader>
            <CardBody>
              <Table responsive hover className="align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    <th>ID Historial</th>
                    <th>Producto</th>
                    <th>Precio Anterior</th>
                    <th>Precio Nuevo</th>
                    <th>Fecha Cambio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length > 0
                    ? historial.map((h) => {
                        const prod = productos.find(
                          (p) => p.idproducto === h.idproducto
                        );
                        return (
                          <tr key={h.idhistorial}>
                            <td>{h.idhistorial}</td>
                            <td>{prod?.nombre || h.idproducto}</td>
                            <td>{h.precioanterior}</td>
                            <td>{h.precionuevo}</td>
                            <td>
                              {new Date(h.fechacambio).toLocaleString()}
                            </td>
                            <td>
                              <Button
                                size="sm"
                                color="info"
                                className="me-2"
                                onClick={() => editarClick(h)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => solicitarBorrado(h)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No hay registros
                        </td>
                      </tr>
                    )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar/editar registro */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Registro" : "Agregar Registro"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Buscar Producto</Label>
              <Input
                type="text"
                placeholder="Filtrar productos..."
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                className="mb-2"
              />
              <Label>Producto</Label>
              <Input
                type="select"
                name="idproducto"
                value={form.idproducto}
                onChange={handleChange}
              >
                <option value="">-- Selecciona un producto --</option>
                {productosFiltrados.map((p) => (
                  <option key={p.idproducto} value={p.idproducto}>
                    {p.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Precio Anterior</Label>
              <Input
                type="number"
                name="precioanterior"
                value={form.precioanterior}
                onChange={handleChange}
                step="0.01"
              />
            </FormGroup>
            <FormGroup>
              <Label>Precio Nuevo</Label>
              <Input
                type="number"
                name="precionuevo"
                value={form.precionuevo}
                onChange={handleChange}
                step="0.01"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {modoEdicion ? (
            <Button color="success" onClick={actualizarRegistro}>
              Actualizar
            </Button>
          ) : (
            <Button color="primary" onClick={agregarRegistro}>
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
          {registroAEliminar && (
            <>
              <p>
                Estás a punto de eliminar el registro{" "}
                <strong>#{registroAEliminar.idhistorial}</strong>.
              </p>
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

export default PrecioHistorial;
