import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Spinner
} from 'reactstrap';
import axios from 'axios';

const CategoriasForm = ({ isOpen, toggle, onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Este campo es obligatorio.';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'Este campo es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No se encontró un token de autenticación.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        metadata: {
          uri: 'tienda-conveniencia/POST/categorias/'
        },
        request: {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          usuario_creacion: 1
        }
      };

      await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Limpieza y notificación
      setFormData({ nombre: '', descripcion: '' });
      setErrors({});
      onCreated(); // recargar lista
      toggle();    // cerrar modal
    } catch (error) {
      console.error('Error al crear categoría:', error);
      const msg = error?.response?.data?.message || 'Error al guardar la categoría.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nueva Categoría</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="nombre">Nombre</Label>
            <Input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              invalid={!!errors.nombre}
            />
            <FormFeedback>{errors.nombre}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="descripcion">Descripción</Label>
            <Input
              type="textarea"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              invalid={!!errors.descripcion}
            />
            <FormFeedback>{errors.descripcion}</FormFeedback>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Guardar'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CategoriasForm;
