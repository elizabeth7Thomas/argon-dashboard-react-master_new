import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";

const GasolineTypeForm = ({ isOpen, toggle, onSubmit, fuel }) => {
  const [formData, setFormData] = useState({
    fuelId: null,
    fuelName: "",
    costPriceGalon: "",
    salePriceGalon: "",
    createdBy: { employeeId: "N/A", employeeName: "N/A" },
  });

  useEffect(() => {
    if (fuel) {
      setFormData(fuel);
    } else {
      setFormData({
        fuelId: null,
        fuelName: "",
        costPriceGalon: "",
        salePriceGalon: "",
        createdBy: { employeeId: "N/A", employeeName: "N/A" },
      });
    }
  }, [fuel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {fuel ? "Editar Tipo de Combustible" : "Nuevo Tipo de Combustible"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="fuelName">Nombre del Combustible</Label>
            <Input
              id="fuelName"
              name="fuelName"
              type="text"
              placeholder="Ej: Gasolina Premium"
              value={formData.fuelName}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Precio costo</Label>
            <Input
              type="number"
              name="costPriceGalon"
              value={formData.costPriceGalon}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Precio venta</Label>
            <Input
              type="number"
              name="salePriceGalon"
              value={formData.salePriceGalon}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              {fuel ? "Guardar Cambios" : "Guardar"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default GasolineTypeForm;
