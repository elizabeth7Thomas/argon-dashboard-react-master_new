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

const ModalAgregarTipoServicio = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    NombreTipo: "",
    PrecioBase: "",
    idServicio: "",
  });

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);  // Agregamos un estado de carga
  const [error, setError] = useState("");  // Para manejar errores

  const obtenerServicios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/servicios");
      if (!res.ok) throw new Error("No se pudo obtener los servicios");
      const data = await res.json();
      setServicios(data);  // Guardamos los servicios solo si la respuesta es válida
    } catch (err) {
      setError(err.message);  // Guardamos el mensaje de error si algo falla
    } finally {
      setLoading(false);  // Terminamos de cargar
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);  // Cuando se abre el modal, comenzamos a cargar
      setError("");  // Limpiamos cualquier error anterior
      obtenerServicios();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ NombreTipo: "", PrecioBase: "", idServicio: "" });
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
            <Label for="PrecioBase">Precio Base</Label>
            <Input
              type="number"
              name="PrecioBase"
              value={form.PrecioBase}
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
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Agregar
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarTipoServicio;
