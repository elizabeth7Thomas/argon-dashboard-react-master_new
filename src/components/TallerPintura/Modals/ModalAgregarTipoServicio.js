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

const ModalAgregarTipoServicio = ({ isOpen, toggle, onSuccess }) => {
  const [form, setForm] = useState({
    NombreTipo: "",
    idServicio: "",
  });

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const obtenerServicios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/servicios");
      if (!res.ok) throw new Error("No se pudo obtener los servicios");
      const data = await res.json();
      setServicios(data);
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
      const response = await fetch("http://localhost:8000/pintura/POST/tiposervicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NombreTipo: form.NombreTipo,
          idServicio: parseInt(form.idServicio),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al guardar los datos.");
      }

      const result = await response.json();
      console.log("Guardado exitosamente:", result);
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
      <ModalHeader toggle={toggle}>Agregar Tipo de Servicio</ModalHeader>
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
          {submitting ? "Agregando..." : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={submitting}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarTipoServicio;
