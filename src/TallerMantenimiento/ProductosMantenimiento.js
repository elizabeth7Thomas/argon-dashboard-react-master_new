import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
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

const ProductosMantenimiento = () => {
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    idCategoria: "",
  });

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFormulario({
        nombre: "",
        descripcion: "",
        precio: "",
        idCategoria: "",
      });
      setModoEdicion(false);
      setProductoEditando(null);
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    const nuevoProducto = {
      idProducto: Date.now(),
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: parseFloat(formulario.precio),
      idCategoria: parseInt(formulario.idCategoria),
      categoria: {
        idCategoria: parseInt(formulario.idCategoria),
        nombre: "Nombre temporal",
        descripcion: "Descripción temporal",
      },
    };

    setProductos([...productos, nuevoProducto]);
    toggle();
  };

  const handleEditarClick = (producto) => {
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      idCategoria: producto.idCategoria,
    });
    setModoEdicion(true);
    setProductoEditando(producto);
    setModal(true);
  };

  const handleActualizar = () => {
    const actualizados = productos.map((p) =>
      p.idProducto === productoEditando.idProducto
        ? {
            ...p,
            nombre: formulario.nombre,
            descripcion: formulario.descripcion,
            precio: parseFloat(formulario.precio),
            idCategoria: parseInt(formulario.idCategoria),
            categoria: {
              idCategoria: parseInt(formulario.idCategoria),
              nombre: "Nombre temporal",
              descripcion: "Descripción temporal",
            },
          }
        : p
    );
    setProductos(actualizados);
    toggle();
  };

  const handleEliminar = (id) => {
    setProductos(productos.filter((p) => p.idProducto !== id));
  };

  return (
    <>
      
      <Container className="mt-4" fluid>
        <Row>
          <Col>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3>Lista de Productos</h3>
                <Button color="primary" onClick={toggle}>
                  Agregar Producto
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.idProducto}>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                        <td>{producto.precio}</td>
                        <td>{producto.categoria?.nombre}</td>
                        <td>
                          <Button
                            size="sm"
                            color="warning"
                            className="me-2"
                            onClick={() => handleEditarClick(producto)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => handleEliminar(producto.idProducto)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No hay productos agregados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal Agregar/Editar */}
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
                name="precio"
                value={formulario.precio}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>ID Categoría</Label>
              <Input
                type="number"
                name="idCategoria"
                value={formulario.idCategoria}
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
    </>
  );
};

export default ProductosMantenimiento;
