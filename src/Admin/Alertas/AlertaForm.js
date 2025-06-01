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
} from "reactstrap";

const tipos = [
  { value: "tienda_de_conveniencia", label: "Tienda de Conveniencia" },
  { value: "gasolinera", label: "Gasolinera" },
  { value: "repuestos", label: "Repuestos" },
  { value: "pintura", label: "Pintura" },
];

export default function AlertaForm({
  isOpen,
  toggle,
  onGuardar,
  alertaEditar,
}) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: tipos[0].value,
  });

  useEffect(() => {
    if (alertaEditar) {
      setForm({
        titulo: alertaEditar.titulo || "",
        descripcion: alertaEditar.descripcion || "",
        tipo: alertaEditar.tipo || tipos[0].value,
      });
    } else {
      setForm({
        titulo: "",
        descripcion: "",
        tipo: tipos[0].value,
      });
    }
  }, [alertaEditar, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.titulo.trim() || !form.descripcion.trim()) return;
    onGuardar(form);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {alertaEditar ? "Editar Alerta" : "Registrar Nueva Alerta"}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="titulo">Título</Label>
          <Input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título"
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
          />
        </FormGroup>
        <FormGroup>
          <Label for="tipo">Tipo</Label>
          <Input
            type="select"
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          >
            {tipos.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {alertaEditar ? "Actualizar" : "Guardar"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}