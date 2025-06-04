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
} from "reactstrap";
import apiClient from "../utils/apiClient";

export default function DepositForm({ isOpen, onSave, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    maxCapacity: "",
    currentCapacity: "",
    fuel: { fuelId: "", fuelName: "" },
  });
  const [fuelTypes, setFuelTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFuelTypes = async () => {
      setLoading(true);
      try {
        const response = await apiClient.post("", {
          metadata: { uri: "fuelType/list" },
          request: {},
        });
        setFuelTypes(response.data?.response?.data || []);
      } catch (error) {
        console.error("Error loading fuel types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuelTypes();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        generalDepositId: initialData.generalDepositId || null,
        maxCapacity: initialData.maxCapacity || "",
        currentCapacity: initialData.currentCapacity || "",
        fuel: {
          fuelId: initialData.fuel?.fuelId || "",
          fuelName: initialData.fuel?.fuelName || "",
          salePriceGalon: initialData.fuel?.salePriceGalon || 0,
        },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fuelId") {
      const selectedFuel = fuelTypes.find((fuel) => fuel.fuelId === value);
      setFormData((prev) => ({
        ...prev,
        fuel: {
          fuelId: value,
          fuelName: selectedFuel?.fuelName ?? "",
          salePriceGalon: selectedFuel?.salePriceGalon ?? 0,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (parseFloat(formData.currentCapacity) > parseFloat(formData.maxCapacity)) {
      setError("La cantidad actual no puede superar la capacidad máxima");
      return;
    }
    
    setError(null);
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>Formulario de Depósito</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            {error && (
              <Alert color="danger" className="mb-4">
                {error}
              </Alert>
            )}
            <Label>Capacidad Máxima (gal)</Label>
            <Input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Capacidad Actual (gal)</Label>
            <Input
              type="number"
              name="currentCapacity"
              value={formData.currentCapacity}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Tipo de Combustible</Label>
            <Input
              type="select"
              name="fuelId"
              value={formData.fuel.fuelId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccione un tipo de combustible</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel.fuelId} value={fuel.fuelId}>
                  {fuel.fuelName}
                </option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}
