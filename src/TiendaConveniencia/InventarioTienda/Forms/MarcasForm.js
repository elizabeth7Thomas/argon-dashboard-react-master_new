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

const MarcasForm = ({ isOpen, toggle, onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Este campo es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const payload = {
      metadata: {
        uri: '/tienda-conveniencia/POST/marcas/' // URI exacta según el curl
      },
      request: {
        nombre: formData.nombre.trim(),
        usuario_creacion: 1
      }
    };

    try {
      await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFormData({ nombre: '' });
      setErrors({});
      onCreated(); // notificar al componente padre
      toggle();    // cerrar modal
    } catch (error) {
      console.error('Error al crear marca:', error);
      const msg = error?.response?.data?._broker_message || 'Error al guardar la marca.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nueva Marca</ModalHeader>
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

export default MarcasForm;
