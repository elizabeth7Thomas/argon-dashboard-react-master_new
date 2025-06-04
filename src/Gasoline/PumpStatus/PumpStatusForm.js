import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner
} from "reactstrap";
import { createPump, updatePump } from "./PumpService";

export default function PumpStatusForm({ isOpen, toggle, initialData, refreshList }) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getInitialFormData() {
    return initialData ? {
      bombNumber: initialData.bombNumber?.toString() || "",
      servedQuantity: initialData.servedQuantity?.toString() || "",
      employeeId: initialData.employeeInCharge?.employeeId || "",
      employeeName: initialData.employeeInCharge?.employeeName || "",
      status: initialData.status?.toString() || "1",
    } : {
      bombNumber: "",
      servedQuantity: "",
      employeeId: "",
      employeeName: "",
      status: "1",
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validación
    if (!formData.bombNumber || !formData.servedQuantity || 
        !formData.employeeId || !formData.employeeName) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("No se encontró información de usuario");

      const payload = {
        bombNumber: parseInt(formData.bombNumber),
        servedQuantity: parseFloat(formData.servedQuantity),
        employeeInCharge: {
          employeeId: formData.employeeId,
          employeeName: formData.employeeName,
        },
        status: parseInt(formData.status),
        createdBy: { employeeId: "N/A", employeeName: "N/A" }, 
        updatedBy: { employeeId: "N/A", employeeName: "N/A" },
      };

      if (initialData) {
        await updatePump(initialData.bombId, payload);
        setSuccess("Bomba actualizada correctamente");
      } else {
        
        await createPump(payload);
        setSuccess("Bomba creada correctamente");
      }

      refreshList();
      setTimeout(toggle, 1500);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Ocurrió un error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {initialData ? "Editar Bomba" : "Nueva Bomba"}
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
          <Form>
          <FormGroup>
            <Label for="bombNumber">Número de Bomba</Label>
            <Input
              type="number"
              name="bombNumber"
              id="bombNumber"
              value={formData.bombNumber}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="servedQuantity">Cantidad Servida (galones)</Label>
            <Input
              type="number"
              step="0.01"
              name="servedQuantity"
              id="servedQuantity"
              value={formData.servedQuantity}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="employeeId">ID del Encargado</Label>
            <Input
              type="text"
              name="employeeId"
              id="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="employeeName">Nombre del Encargado</Label>
            <Input
              type="text"
              name="employeeName"
              id="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="status">Estado</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="2">Inactivo</option>
              <option value="3">Activa</option>
              <option value="4">Mantenimiento</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          color="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" /> Procesando...
            </>
          ) : initialData ? (
            "Actualizar"
          ) : (
            "Crear"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}