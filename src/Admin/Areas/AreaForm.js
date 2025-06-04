import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
  Alert,
  Spinner,
} from "reactstrap";
import axios from "axios";

export default function AreaForm({
  isOpen,
  toggle,
  onGuardar,
  areaEditar,
}) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    id_servicio: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar catálogo de servicios desde localStorage
  const catalogoServicios = JSON.parse(localStorage.getItem("catalogo_servicios") || "[]");

  useEffect(() => {
    setAlert(null);
    setSuccess(null);
    if (areaEditar) {
      setForm({
        nombre: areaEditar.nombre || '',
        descripcion: areaEditar.descripcion || '',
        id_servicio: areaEditar.id_servicio || '',
      });
    } else {
      setForm({
        nombre: '',
        descripcion: '',
        id_servicio: '',
      });
    }
  }, [areaEditar, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validación estricta antes de enviar
  function validatePayload(payload) {
    try {
      const jsonString = JSON.stringify(payload);
      const parsed = JSON.parse(jsonString);
      const findInvalid = (obj, path = '') => {
        for (const key in obj) {
          const value = obj[key];
          const currentPath = path ? `${path}.${key}` : key;
          if (value === undefined) {
            console.warn(`⚠️ Valor undefined en: ${currentPath}`);
          }
          if (value === null) {
            console.warn(`⚠️ Valor null en: ${currentPath}`);
          }
          if (typeof value === 'string' && value.trim() === '') {
            console.warn(`⚠️ String vacío en: ${currentPath}`);
          }
          if (typeof value === 'object' && value !== null) {
            findInvalid(value, currentPath);
          }
        }
      };
      findInvalid(parsed);
      return true;
    } catch (err) {
      console.error("❌ Error al serializar el payload:", err);
      return false;
    }
  }

  const handleSubmit = async () => {
    setAlert(null);
    setSuccess(null);
    setLoading(true);

    if (!form.nombre.trim() || !form.descripcion.trim() || !form.id_servicio) {
      setAlert("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const isEdit = !!areaEditar && !!areaEditar.id;
    const areaId = areaEditar?.id;

    const uri = isEdit
      ? `administracion/PUT/areas/${areaId}`
      : "administracion/POST/areas";

    const payload = {
      metadata: { uri },
      request: {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        id_servicio: Number(form.id_servicio),
      }
    };

    if (!validatePayload(payload)) {
      setAlert("El formato de los datos es inválido. Revisa los campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const brokerResponse = response.data?.response?.data;
      if (brokerResponse && brokerResponse.message) {
        setSuccess(brokerResponse.message);
        setAlert(null);
        if (onGuardar) onGuardar(brokerResponse);
      } else {
        setAlert("Área guardada, pero no se recibió mensaje de confirmación.");
      }
    } catch (error) {
      let brokerMsg = "";
      let brokerStatus = "";
      let brokerError = "";
      let brokerPath = "";
      let brokerTimestamp = "";
      if (error.response) {
        const resp = error.response.data?.response;
        brokerMsg = resp?._broker_message;
        brokerStatus = resp?._broker_status;
        brokerError = resp?.data?.error;
        brokerPath = resp?.data?.path;
        brokerTimestamp = resp?.data?.timestamp;
        setAlert(
          <div>
            <strong>Error del broker:</strong>
            {brokerMsg && (
              <>
                <br />
                <span className="text-withe">{brokerMsg}</span>
              </>
            )}
            {brokerStatus && (
              <>
                <br />
                <span className="text-withe">Código: {brokerStatus}</span>
              </>
            )}
            {brokerError && (
              <>
                <br />
                <span className="text-withe">Detalle: {brokerError}</span>
              </>
            )}
            {brokerPath && (
              <>
                <br />
                <span className="text-withe">Ruta: {brokerPath}</span>
              </>
            )}
            {brokerTimestamp && (
              <>
                <br />
                <span className="text-withe">Fecha: {brokerTimestamp}</span>
              </>
            )}
          </div>
        );
      } else if (error.request) {
        setAlert("No hubo respuesta del servidor. Revisa tu conexión.");
      } else {
        setAlert(error.message || "Error desconocido.");
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {areaEditar ? "Editar Área" : "Registrar Nueva Área"}
      </ModalHeader>
      <ModalBody>
        {alert && <Alert color="danger">{alert}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        <FormGroup>
          <Label for="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            disabled={loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="descripcion">Descripción</Label>
          <Input
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            disabled={loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="id_servicio">Servicio</Label>
          <Input
            type="select"
            id="id_servicio"
            name="id_servicio"
            value={form.id_servicio}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Seleccione un servicio</option>
            {catalogoServicios.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : (areaEditar ? "Actualizar" : "Guardar")}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}