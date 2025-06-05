import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, Card, CardHeader, CardBody, Table,
  Row, Col, Modal, ModalHeader, ModalBody,
  ModalFooter, Form, FormGroup, Input, Label
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Reemplaza con tu función de broker real
const brokerRequest = async (uri, requestPayload = {}) => {
  const response = await axios.post("http://64.23.169.22:3761/broker/api/rest", {
    metadata: { uri },
    request: requestPayload
  });
  return response.data;
};

const ProductosMantenimiento = () => {
  const [productos, setProductos] = useState([]);
  const [categoriasList, setCategoriasList] = useState([]);
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: "", descripcion: "", precio: "",
    id_categoria: "", existencia_minima: "", status: 1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [errorModal, setErrorModal] = useState({ open: false, mensaje: "" });

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await brokerRequest("tallerrepuestos/productos");
      setProductos(data);
    } catch (error) {
      mostrarError("Error al obtener productos.");
    }
  };

  const obtenerCategorias = async () => {
    try {
      const data = await brokerRequest("tallerrepuestos/categorias");
      const activas = data.filter((c) => c.status === 1);
      setCategoriasList(activas.map(c => ({
        id: c.idcategoria, nombre: c.nombre,
      })));
    } catch (error) {
      mostrarError("Error al obtener categorías.");
    }
  };

  const mostrarError = (mensaje) => {
    setErrorModal({ open: true, mensaje });
  };

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormulario({
        nombre: "", descripcion: "", precio: "",
        id_categoria: "", existencia_minima: "", status: 1,
      });
      setModoEdicion(false);
      setProductoEditando(null);
      setBusquedaCategoria("");
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    const { nombre, descripcion, precio, id_categoria } = formulario;
    if (!nombre.trim() || !descripcion.trim() || !precio || !id_categoria) {
      mostrarError("Todos los campos obligatorios deben estar llenos.");
      return;
    }

    try {
      const nuevo = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        id_categoria: parseInt(id_categoria, 10),
        existencia_minima: parseInt(formulario.existencia_minima || "0", 10),
        status: formulario.status,
      };
      await brokerRequest("tallerrepuestos/productos", nuevo);
      await obtenerProductos();
      toggle();
    } catch (error) {
      mostrarError("Error al agregar producto.");
    }
  };

  const handleEditarClick = (producto) => {
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      id_categoria: producto.idcategoria.toString(),
      existencia_minima: producto.existenciaminima.toString(),
      status: producto.status,
    });
    setModoEdicion(true);
    setProductoEditando(producto);
    setModal(true);
    setBusquedaCategoria(
      categoriasList.find(c => c.id === producto.idcategoria)?.nombre || ""
    );
  };

  const handleActualizar = async () => {
    if (!productoEditando) return;
    try {
      const actualizado = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        precio: parseFloat(formulario.precio),
        id_categoria: parseInt(formulario.id_categoria, 10),
        existencia_minima: parseInt(formulario.existencia_minima || "0", 10),
        status: formulario.status,
      };
      await brokerRequest(`tallerrepuestos/productos/${productoEditando.idproducto}`, actualizado);
      await obtenerProductos();
      toggle();
    } catch (error) {
      mostrarError("Error al actualizar producto.");
    }
  };

  const solicitarBorrado = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const confirmarBorrado = async () => {
    if (!productoAEliminar) return;
    try {
      await brokerRequest(`tallerrepuestos/productos/${productoAEliminar.idproducto}`, { status: 0 });
      await obtenerProductos();
      setShowDeleteModal(false);
    } catch (error) {
      mostrarError("Error al eliminar producto.");
    }
  };

  const cancelarBorrado = () => {
    setShowDeleteModal(false);
    setProductoAEliminar(null);
  };

  const categoriasFiltradas = categoriasList.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase())
  );

  return (
    <>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="d-flex justify-content-between">
              <h3 className="mb-0">Lista de Productos</h3>
              <Button color="primary" onClick={toggle}>Agregar Producto</Button>
            </CardHeader>
            <CardBody>
              <Table responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Existencia Mínima</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length > 0 ? (
                    productos.map((p) => {
                      const categoria = categoriasList.find(c => c.id === p.idcategoria);
                      return (
                        <tr key={p.idproducto}>
                          <td>{p.nombre}</td>
                          <td>{p.descripcion}</td>
                          <td>{p.precio}</td>
                          <td>{categoria?.nombre || "N/A"}</td>
                          <td>{p.existenciaminima}</td>
                          <td>
                            <Button size="sm" color="info" className="me-2" onClick={() => handleEditarClick(p)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button size="sm" color="danger" onClick={() => solicitarBorrado(p)}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No hay productos disponibles</td>
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
        <ModalHeader toggle={toggle}>{modoEdicion ? "Editar Producto" : "Agregar Producto"}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input name="nombre" value={formulario.nombre} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Descripción</Label>
              <Input name="descripcion" value={formulario.descripcion} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Precio</Label>
              <Input type="number" step="0.01" name="precio" value={formulario.precio} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Buscar Categoría</Label>
              <Input
                type="text"
                placeholder="Buscar..."
                value={busquedaCategoria}
                onChange={(e) => setBusquedaCategoria(e.target.value)}
              />
              <Input
                type="select"
                name="id_categoria"
                value={formulario.id_categoria}
                onChange={handleChange}
              >
                <option value="">-- Selecciona una categoría --</option>
                {categoriasFiltradas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Existencia Mínima</Label>
              <Input name="existencia_minima" value={formulario.existencia_minima} onChange={handleChange} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {modoEdicion ? (
            <Button color="success" onClick={handleActualizar}>Actualizar</Button>
          ) : (
            <Button color="primary" onClick={handleAgregar}>Agregar</Button>
          )}
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Error */}
      <Modal isOpen={errorModal.open} toggle={() => setErrorModal({ open: false, mensaje: "" })}>
        <ModalHeader toggle={() => setErrorModal({ open: false, mensaje: "" })}>Error</ModalHeader>
        <ModalBody>{errorModal.mensaje}</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setErrorModal({ open: false, mensaje: "" })}>Cerrar</Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal isOpen={showDeleteModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>Confirmar eliminación</ModalHeader>
        <ModalBody>
          {productoAEliminar && (
            <>
              <p>¿Estás seguro que deseas eliminar el siguiente producto?</p>
              <ul>
                <li><strong>Nombre:</strong> {productoAEliminar.nombre}</li>
                <li><strong>Descripción:</strong> {productoAEliminar.descripcion}</li>
              </ul>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmarBorrado}>Eliminar</Button>
          <Button color="secondary" onClick={cancelarBorrado}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProductosMantenimiento;
