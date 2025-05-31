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

const ProductosMantenimiento = () => {
  const [productos, setProductos] = useState([]);
  const [categoriasList, setCategoriasList] = useState([]);
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
    existencia_minima: "",
    status: 1,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    obtenerTodosLosProductos();
    obtenerTodasLasCategorias();
  }, []);

  const obtenerTodosLosProductos = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/productos`);
      setProductos(resp.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const obtenerTodasLasCategorias = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/categorias`);
      // Filtramos solo status = 1 (activos)
      const activos = resp.data.filter((c) => c.status === 1);
      setCategoriasList(
        activos.map((c) => ({
          id: c.idcategoria,
          nombre: c.nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Filtrado de categorías por nombre
  const categoriasFiltradas = categoriasList.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase())
  );

  // Abrir/Cerrar modal de Agregar/Editar
  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      // si abrimos para “Nuevo”, limpiamos formulario
      setFormulario({
        nombre: "",
        descripcion: "",
        precio: "",
        id_categoria: "",
        existencia_minima: "",
        status: 1,
      });
      setModoEdicion(false);
      setProductoEditando(null);
      setBusquedaCategoria("");
    }
  };

  // Manejar cambios en formulario
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // 2) Agregar Producto → POST /productos
  const handleAgregar = async () => {
    // validaciones mínimas
    if (
      !formulario.nombre.trim() ||
      !formulario.descripcion.trim() ||
      !formulario.precio ||
      !formulario.id_categoria
    ) {
      return;
    }

    try {
      const nuevo = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        precio: parseFloat(formulario.precio),
        id_categoria: parseInt(formulario.id_categoria, 10),
        existencia_minima: parseInt(formulario.existencia_minima || "0", 10),
        status: formulario.status,
      };

      await axios.post(`${BASE_URL}/productos`, nuevo);
      await obtenerTodosLosProductos();
      toggle();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  // 3) Cargar formulario para edición
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
      categoriasList.find((c) => c.id === producto.idcategoria)?.nombre || ""
    );
  };

  // 4) Actualizar Producto → PUT /productos/:id
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

      await axios.put(
        `${BASE_URL}/productos/${productoEditando.idproducto}`,
        actualizado
      );
      await obtenerTodosLosProductos();
      toggle();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const solicitarBorrado = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const confirmarBorrado = async () => {
    if (!productoAEliminar) return;

    try {
      await axios.delete(
        `${BASE_URL}/productos/${productoAEliminar.idproducto}`
      );
      await obtenerTodosLosProductos();
      setShowDeleteModal(false);
      setProductoAEliminar(null);
    } catch (error) {
      console.error("Error al borrar producto:", error);
    }
  };

  const cancelarBorrado = () => {
    setShowDeleteModal(false);
    setProductoAEliminar(null);
  };

  return (
    <>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Lista de Productos</h3>
                <Button color="primary" onClick={toggle}>
                  Agregar Producto
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive hover className="align-items-center table-flush">
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
                        const categoria = categoriasList.find(
                          (c) => c.id === p.idcategoria
                        );
                        return (
                          <tr key={p.idproducto}>
                            <td>{p.nombre}</td>
                            <td>{p.descripcion}</td>
                            <td>{p.precio}</td>
                            <td>{categoria?.nombre || "N/A"}</td>
                            <td>{p.existenciaminima}</td>
                            <td>
                              <Button
                                size="sm"
                                color="info"
                                className="me-2"
                                onClick={() => handleEditarClick(p)}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-0" />
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => solicitarBorrado(p)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} className="mr-0" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No hay productos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

      {/* Moda para agregar y editar p*/}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Producto" : "Agregar Producto"}
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
              <Label>Precio</Label>
              <Input
                type="number"
                step="0.01"
                name="precio"
                value={formulario.precio}
                onChange={handleChange}
              />
            </FormGroup>

            {/* espacio para la categoria*/}
            <FormGroup>
              <Label>Buscar Categoría</Label>
              <Input
                type="text"
                placeholder="Escribe nombre de categoría..."
                value={busquedaCategoria}
                onChange={(e) => setBusquedaCategoria(e.target.value)}
                className="mb-2"
              />
              <Input
                type="select"
                name="id_categoria"
                value={formulario.id_categoria}
                onChange={handleChange}
              >
                <option value="">-- Selecciona una categoría --</option>
                {categoriasFiltradas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Existencia Mínima</Label>
              <Input
                type="number"
                name="existencia_minima"
                value={formulario.existencia_minima}
                onChange={handleChange}
              />
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

      {/* Modal de Confirmación de eliminacion */}
      <Modal isOpen={showDeleteModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          {productoAEliminar && (
            <>
              <p>
                Estás a punto de eliminar el producto con los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Nombre:</strong> {productoAEliminar.nombre}
                </li>
                <li>
                  <strong>Descripción:</strong> {productoAEliminar.descripcion}
                </li>
                <li>
                  <strong>Precio:</strong> {productoAEliminar.precio}
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

export default ProductosMantenimiento;
