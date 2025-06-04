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
} from "reactstrap";
import axios from "axios";

export default function ProveedorForm({
  isOpen,
  toggle,
  onGuardar,
  proveedorEditar,
}) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    nit: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setAlert(null);
    setSuccess(null);
    if (proveedorEditar) {
      setForm({
        nombres: proveedorEditar.nombres || "",
        apellidos: proveedorEditar.apellidos || "",
        telefono: proveedorEditar.telefono || "",
        nit: proveedorEditar.nit || "",
      });
    } else {
      setForm({
        nombres: "",
        apellidos: "",
        telefono: "",
        nit: "",
      });
    }
  }, [proveedorEditar, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setAlert(null);
    setSuccess(null);

    if (!form.nombres.trim() || !form.apellidos.trim() || !form.telefono.trim() || !form.nit.trim()) {
      setAlert("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const isEdit = !!proveedorEditar && !!proveedorEditar.id;
    const proveedorId = proveedorEditar?.id;

    const uri = isEdit
      ? `administracion/PUT/proveedores/${proveedorId}`
      : "administracion/POST/proveedores";

    const payload = {
      metadata: { uri },
      request: {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        telefono: form.telefono.trim(),
        nit: form.nit.trim(),
      }
    };

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
      const brokerMsg = response.data?.response?._broker_message;
      const brokerStatus = response.data?.response?._broker_status;
      if (brokerResponse && brokerResponse.message) {
        setSuccess(
          <div style={{ color: "#fff" }}>
            <strong>{brokerResponse.message}</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
            {brokerStatus && (
              <>
                <br />
                <span>Código: {brokerStatus}</span>
              </>
            )}
          </div>
        );
        setAlert(null);
        if (onGuardar) onGuardar(brokerResponse);
      } else {
        setAlert("Proveedor guardado, pero no se recibió mensaje de confirmación.");
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
          <div style={{ color: "#fff" }}>
            <strong>Error del broker:</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
            {brokerStatus && (
              <>
                <br />
                <span>Código: {brokerStatus}</span>
              </>
            )}
            {brokerError && (
              <>
                <br />
                <span>Detalle: {brokerError}</span>
              </>
            )}
            {brokerPath && (
              <>
                <br />
                <span>Ruta: {brokerPath}</span>
              </>
            )}
            {brokerTimestamp && (
              <>
                <br />
                <span>Fecha: {brokerTimestamp}</span>
              </>
            )}
          </div>
        );
      } else if (error.request) {
        setAlert(<span style={{ color: "#fff" }}>No hubo respuesta del servidor. Revisa tu conexión.</span>);
      } else {
        setAlert(<span style={{ color: "#fff" }}>{error.message || "Error desconocido."}</span>);
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {proveedorEditar ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
      </ModalHeader>
      <ModalBody>
        {alert && <Alert color="danger">{alert}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        <FormGroup>
          <Label for="nombres">Nombres</Label>
          <Input
            id="nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            placeholder="Nombres"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label for="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label for="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label for="nit">NIT</Label>
          <Input
            id="nit"
            name="nit"
            value={form.nit}
            onChange={handleChange}
            placeholder="NIT"
            disabled={loading}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : proveedorEditar ? "Actualizar" : "Guardar"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}