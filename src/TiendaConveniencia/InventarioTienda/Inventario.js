import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderTienda from 'components/Headers/HeaderTienda';
import {
  Container,
  Row,
 
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_referencia: '',
    unidad_medida: '',
    stock: '',
    stock_minimo: '',
    id_tipo: '',
    id_marca: '',
    es_materia_prima: false,
  });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/inventario');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos: ', error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/inventario', formData);
      obtenerProductos();
      setMostrarFormulario(false);
      setFormData({
        nombre: '', descripcion: '', precio_referencia: '',
        unidad_medida: '', stock: '', stock_minimo: '',
        id_tipo: '', id_marca: '', es_materia_prima: false
      });
    } catch (error) {
      console.error('Error al agregar el producto', error);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmacion) return;

    try {
      await axios.delete(`http://localhost:3001/inventario/${id}`);
      obtenerProductos();
    } catch (error) {
      console.error('Error al eliminar el producto', error);
    }
  };

  return (
    <>
      <HeaderTienda />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow p-4">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Inventario de Productos</h2>

                <table className="w-full border mb-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Nombre</th>
                      <th className="border p-2">Descripción</th>
                      <th className="border p-2">Precio</th>
                      <th className="border p-2">Stock</th>
                      <th className="border p-2">Tipo</th>
                      <th className="border p-2">Marca</th>
                      <th className="border p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td className="border p-2">{producto.id}</td>
                        <td className="border p-2">{producto.nombre}</td>
                        <td className="border p-2">{producto.descripcion}</td>
                        <td className="border p-2">Q{producto.precio_referencia}</td>
                        <td className="border p-2">{producto.stock}</td>
                        <td className="border p-2">{producto.tipo}</td>
                        <td className="border p-2">{producto.marca}</td>
                        <td className="border p-2">
                          <button className="bg-red-500 text-white px-2 rounded mr-2" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p>Total de productos: {productos.length}</p>

                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  onClick={() => setMostrarFormulario(true)}
                >
                  Ingresar Producto
                </button>

                {/* Modal con el formulario */}
                <Modal isOpen={mostrarFormulario} toggle={() => setMostrarFormulario(!mostrarFormulario)}>
                  <ModalHeader toggle={() => setMostrarFormulario(!mostrarFormulario)}>Agregar Producto</ModalHeader>
                  <Form onSubmit={agregarProducto}>
                    <ModalBody>
                      <FormGroup>
                        <Label>Nombre</Label>
                        <Input type="text" name="nombre" value={formData.nombre} onChange={manejarCambio} required />
                      </FormGroup>
                      <FormGroup>
                        <Label>Descripción</Label>
                        <Input type="text" name="descripcion" value={formData.descripcion} onChange={manejarCambio} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Precio de referencia</Label>
                        <Input type="number" name="precio_referencia" value={formData.precio_referencia} onChange={manejarCambio} required />
                      </FormGroup>
                      <FormGroup>
                        <Label>Unidad de medida</Label>
                        <Input type="text" name="unidad_medida" value={formData.unidad_medida} onChange={manejarCambio} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Stock</Label>
                        <Input type="number" name="stock" value={formData.stock} onChange={manejarCambio} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Stock mínimo</Label>
                        <Input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={manejarCambio} />
                      </FormGroup>
                      <FormGroup>
                        <Label>ID Tipo</Label>
                        <Input type="number" name="id_tipo" value={formData.id_tipo} onChange={manejarCambio} />
                      </FormGroup>
                      <FormGroup>
                        <Label>ID Marca</Label>
                        <Input type="number" name="id_marca" value={formData.id_marca} onChange={manejarCambio} />
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="checkbox" name="es_materia_prima" checked={formData.es_materia_prima} onChange={manejarCambio} />
                          Es materia prima
                        </Label>
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success" type="submit">Guardar</Button>{' '}
                      <Button color="secondary" onClick={() => setMostrarFormulario(false)}>Cancelar</Button>
                    </ModalFooter>
                  </Form>
                </Modal>

              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Inventario;
