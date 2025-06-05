import React, { useState, useEffect } from 'react';
import {
  Modal, ModalHeader, ModalBody,
  Form, FormGroup, Label, Input, Button, Alert, Row, Col
} from 'reactstrap';
import axios from 'axios';

const CierreCajaForm = ({ isOpen, toggle, onSuccess }) => {
  const [form, setForm] = useState({
    IdCaja: '',
    Servicio: '4',
    CantidadFinal: '',
    Empleado: {
      IdEmpleado: '',
      NombreCompleto: '',
    },
    Retiro: 0
  });

  const [empleados, setEmpleados] = useState([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
  const [errorEmpleados, setErrorEmpleados] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const servicios = [
    { value: '4', label: 'Gasolineria' },
    { value: '5', label: 'Tienda de conveniencia' },
    { value: '6', label: 'Repuestos' },
    { value: '7', label: 'Pintura' }
  ];

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoadingEmpleados(true);
      setErrorEmpleados(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://64.23.169.22:3761/broker/api/rest',
          {
            metadata: { uri: 'administracion/GET/empleados' },
            request: {}
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        const empleadosData = response?.data?.response?.data?.empleados;
        if (Array.isArray(empleadosData)) {
          setEmpleados(empleadosData);
        } else {
          setErrorEmpleados('No se encontraron empleados.');
        }
      } catch (err) {
        console.error('Error al obtener empleados:', err);
        setErrorEmpleados('Error al cargar la lista de empleados.');
      } finally {
        setLoadingEmpleados(false);
      }
    };

    if (isOpen) {
      fetchEmpleados();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['CantidadFinal', 'Retiro'].includes(name) && parseFloat(value) < 0) return;

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectEmpleado = (e) => {
    const empleadoId = parseInt(e.target.value);
    const empleadoSeleccionado = empleados.find(e => e.empleado.id === empleadoId);

    if (empleadoSeleccionado) {
      setForm(prev => ({
        ...prev,
        Empleado: {
          IdEmpleado: empleadoSeleccionado.empleado.id.toString(),
          NombreCompleto: `${empleadoSeleccionado.empleado.nombres} ${empleadoSeleccionado.empleado.apellidos}`
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { IdCaja, Servicio, CantidadFinal, Empleado } = form;

    if (!IdCaja || !Servicio || !CantidadFinal || !Empleado?.IdEmpleado) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'pagos/cierre/crear' },
          request: {
            IdCaja: parseInt(IdCaja),
            Servicio: parseInt(Servicio),
            CantidadFinal: parseFloat(CantidadFinal),
            Empleado,
            Retiro: parseFloat(form.Retiro || 0)
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 201) {
        setSuccess('Cierre de caja creado exitosamente.');
        onSuccess?.();
        setTimeout(toggle, 1500);
      } else {
        const mensaje = response.data?.response?._broker_message || 'Error al crear el cierre de caja.';
        setError(mensaje);
      }
    } catch (err) {
      const mensaje = err.response?.data?.response?._broker_message || err.response?.data?.mensaje;
      setError(mensaje || 'Ocurrió un error al enviar el formulario.');
      console.error('Error al crear cierre:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Crear Cierre de Caja</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="IdCaja">Caja</Label>
                <Input
                  type="number"
                  name="IdCaja"
                  id="IdCaja"
                  value={form.IdCaja}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="Servicio">Servicio</Label>
                <Input
                  type="select"
                  name="Servicio"
                  id="Servicio"
                  value={form.Servicio}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((servicio) => (
                    <option key={servicio.value} value={servicio.value}>
                      {servicio.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="Empleado">Empleado</Label>
                {loadingEmpleados ? (
                  <Input type="select" disabled>
                    <option>Cargando empleados...</option>
                  </Input>
                ) : errorEmpleados ? (
                  <Alert color="danger">{errorEmpleados}</Alert>
                ) : (
                  <Input
                    type="select"
                    name="Empleado"
                    id="Empleado"
                    value={form.Empleado.IdEmpleado}
                    onChange={handleSelectEmpleado}
                    required
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((e) => (
                      <option key={e.empleado.id} value={e.empleado.id}>
                        {e.empleado.nombres} {e.empleado.apellidos}
                      </option>
                    ))}
                  </Input>
                )}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="NombreCompleto">Nombre Completo</Label>
                <Input
                  type="text"
                  name="NombreCompleto"
                  id="NombreCompleto"
                  value={form.Empleado.NombreCompleto}
                  readOnly
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="CantidadFinal">Cantidad Final</Label>
                <Input
                  type="number"
                  name="CantidadFinal"
                  id="CantidadFinal"
                  value={form.CantidadFinal}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="Retiro">Retiro</Label>
                <Input
                  type="number"
                  name="Retiro"
                  id="Retiro"
                  value={form.Retiro}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
              </FormGroup>
            </Col>
          </Row>

          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}

          <div className="d-flex justify-content-end mt-3">
            <Button color="secondary" onClick={toggle} className="mr-2">
              Cancelar
            </Button>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CierreCajaForm;
