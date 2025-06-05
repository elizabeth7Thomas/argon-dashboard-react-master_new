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

const tipos = [
  { value: "tienda_de_conveniencia", label: "Tienda de Conveniencia" },
  { value: "gasolinera", label: "Gasolinera" },
  { value: "repuestos", label: "Repuestos" },
  { value: "pintura", label: "Pintura" },
];

const tipoToUri = {
  tienda_de_conveniencia: "administracion/POST/alertas/tienda_de_conveniencia",
  gasolinera: "administracion/POST/alertas/gasolinera",
  repuestos: "administracion/POST/alertas/repuestos",
  pintura: "administracion/POST/alertas/pintura",
};

export default function AlertaForm({
  isOpen,
  toggle,
  onGuardar,
  alertaEditar,
}) {
  const [form, setForm] = useState({
    tipo: "",
    nombre_producto: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setAlert(null);
    if (alertaEditar) {
      setForm({
        tipo: alertaEditar.tipo || "",
        nombre_producto: alertaEditar.nombre_producto || "",
      });
    } else {
      setForm({
        tipo: "",
        nombre_producto: "",
      });
    }
  }, [alertaEditar, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.tipo) {
      setAlert("Debes seleccionar el servicio.");
      return;
    }
    if (!form.nombre_producto.trim()) {
      setAlert("Debes ingresar el nombre del producto.");
      return;
    }
    setLoading(true);
    setAlert(null);

    const token = localStorage.getItem("token");
    const uri = tipoToUri[form.tipo];
    const payload = {
      metadata: { uri },
      request: {
        nombre_producto: form.nombre_producto.trim(),
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
      if (brokerResponse && brokerResponse.message) {
        setAlert(
          <span>
            <strong>{brokerResponse.message}</strong>
            {brokerMsg && (
              <>
                <br />
                <span className="text-success">{brokerMsg}</span>
              </>
            )}
          </span>
        );
        if (onGuardar) onGuardar(form); // Notifica al padre si es necesario
        // No cerrar el modal automáticamente, para que el usuario vea el mensaje
      } else {
        setAlert("Alerta agregada, pero no se recibió mensaje de confirmación.");
      }
    } catch (error) {
      let msg = "Error desconocido.";
      let brokerMsg = "";
      if (error.response) {
        msg =
          error.response.data?.response?.data?.message ||
          error.response.data?.response?.data?.error ||
          error.response.data?.response?.data?.status ||
          error.response.data?.response?.data?.statusText ||
          error.response.data?.response?.data?.path ||
          error.response.data?.response?._broker_message ||
          error.response.data?.message ||
          error.response.data?.error ||
          `Error ${error.response.status}: ${error.response.statusText}`;
        brokerMsg = error.response.data?.response?._broker_message;
      } else if (error.request) {
        msg = "No hubo respuesta del servidor. Revisa tu conexión.";
      } else if (error.message) {
        msg = error.message;
      }
      setAlert(msg + (brokerMsg ? `\n${brokerMsg}` : ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {alertaEditar ? "Editar Alerta" : "Registrar Nueva Alerta"}
      </ModalHeader>
      <ModalBody>
        {alert && (
          <Alert color="success" fade={true} className="mb-3">
            <div style={{ whiteSpace: "pre-wrap" }}>{alert}</div>
          </Alert>
        )}
        <FormGroup>
          <Label for="tipo">Servicio</Label>
          <Input
            type="select"
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Seleccione un servicio</option>
            {tipos.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="nombre_producto">Nombre del producto</Label>
          <Input
            id="nombre_producto"
            name="nombre_producto"
            value={form.nombre_producto}
            onChange={handleChange}
            placeholder="ej: Aceite 5W30"
            disabled={loading || !form.tipo}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : (alertaEditar ? "Actualizar" : "Guardar")}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}