import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner
} from 'reactstrap';
import axios from 'axios';

const ProductForm = ({ isOpen, toggle, onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_referencia: '',
    id_unidad_medida: '',
    stock_minimo: '',
    id_categoria: '',
    tipo: 'FINAL',
    es_materia_prima: false,
    receta: '',
    usuario_creacion: '',
    id_marca: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('token');

  const fetchOptions = async () => {
    try {
      const [catRes, marcaRes] = await Promise.all([
        axios.post('http://64.23.169.22:3761/broker/api/rest', {
          metadata: { uri: '/tienda-conveniencia/GET/categorias/' },
          request: {}
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post('http://64.23.169.22:3761/broker/api/rest', {
          metadata: { uri: 'tienda-conveniencia/GET/marcas/' },
          request: {}
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCategorias(catRes.data?.response?.data || []);
      setMarcas(marcaRes.data?.response?.data || []);
    } catch (err) {
      console.error('Error cargando categorías o marcas:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        precio_referencia: parseFloat(formData.precio_referencia),
        stock_minimo: parseInt(formData.stock_minimo),
        id_categoria: parseInt(formData.id_categoria),
        id_unidad_medida: parseInt(formData.id_unidad_medida),
        id_marca: parseInt(formData.id_marca),
        usuario_creacion: parseInt(formData.usuario_creacion)
      };

      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/POST/productos' },
          request: payload
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.response?.status === 'success') {
        setSuccess(true);
        if (onCreated) onCreated();
        toggle();
      } else {
        setError('No se pudo crear el producto. Verifica los datos.');
      }
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError('Error en la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar nuevo producto</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">Producto creado exitosamente.</Alert>}

          <FormGroup>
            <Label>Nombre</Label>
            <Input name="nombre" value={formData.nombre} onChange={handleChange} required />
          </FormGroup>

          <FormGroup>
            <Label>Descripción</Label>
            <Input name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </FormGroup>

          <FormGroup>
            <Label>Precio de referencia</Label>
            <Input type="number" name="precio_referencia" value={formData.precio_referencia} onChange={handleChange} required step="0.01" />
          </FormGroup>

          <FormGroup>
            <Label>ID Unidad de medida</Label>
            <Input type="number" name="id_unidad_medida" value={formData.id_unidad_medida} onChange={handleChange} required />
          </FormGroup>

          <FormGroup>
            <Label>Stock mínimo</Label>
            <Input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} required />
          </FormGroup>

          <FormGroup>
            <Label>Categoría</Label>
            <Input type="select" name="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Marca</Label>
            <Input type="select" name="id_marca" value={formData.id_marca} onChange={handleChange} required>
              <option value="">Selecciona una marca</option>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id}>{marca.nombre}</option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Tipo</Label>
            <Input type="text" name="tipo" value={formData.tipo} onChange={handleChange} required />
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input type="checkbox" name="es_materia_prima" checked={formData.es_materia_prima} onChange={handleChange} />
              ¿Es materia prima?
            </Label>
          </FormGroup>

          <FormGroup className="mt-2">
            <Label>Receta</Label>
            <Input type="textarea" name="receta" value={formData.receta} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label>ID Usuario creación</Label>
            <Input type="number" name="usuario_creacion" value={formData.usuario_creacion} onChange={handleChange} required />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading}>Cancelar</Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Guardar'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ProductForm;
