import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";

const ModalAgregarTipoServicio = ({
  isOpen,
  toggle,
  onSuccess,
  modoEdicion = false,
  tipoServicio = null,
}) => {
  const [form, setForm] = useState({
    NombreTipo: "",
    idServicio: "",
  });

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (modoEdicion && tipoServicio) {
      setForm({
        NombreTipo: tipoServicio.NombreTipo,
        idServicio: tipoServicio.idServicio.toString(),
      });
    } else {
      setForm({ NombreTipo: "", idServicio: "" });
    }
  }, [modoEdicion, tipoServicio]);

  const obtenerServicios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/servicios",
          },
          request: {},
        }),
      });

      if (!res.ok) throw new Error("No se pudo obtener los servicios");
      const data = await res.json();
      setServicios(data.response?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError("");
      obtenerServicios();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.NombreTipo || !form.idServicio) {
      setSubmitError("Todos los campos son obligatorios.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");

      const uri = modoEdicion
        ? `/pintura/PUT/tiposervicios/${tipoServicio.idTipoServicio}`
        : "/pintura/POST/tiposervicios";

      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: { uri },
          request: {
            NombreTipo: form.NombreTipo,
            idServicio: parseInt(form.idServicio),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al guardar los datos.");
      }

      const result = await response.json();
      console.log("Procesado:", result);
      if (onSuccess) onSuccess();
      toggle();
      setForm({ NombreTipo: "", idServicio: "" });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {modoEdicion ? "Editar Tipo de Servicio" : "Agregar Tipo de Servicio"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="NombreTipo">Nombre del Tipo</Label>
            <Input
              name="NombreTipo"
              value={form.NombreTipo}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="idServicio">Servicio Relacionado</Label>
            {loading ? (
              <div>Cargando servicios...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : (
              <Input
                type="select"
                name="idServicio"
                value={form.idServicio}
                onChange={handleChange}
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((s) => (
                  <option key={s.idServicio} value={s.idServicio}>
                    {s.NombreServicio}
                  </option>
                ))}
              </Input>
            )}
          </FormGroup>
          {submitError && <p className="text-danger">{submitError}</p>}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? modoEdicion
              ? "Guardando..."
              : "Agregando..."
            : modoEdicion
            ? "Guardar Cambios"
            : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={submitting}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarTipoServicio;
