import React, { useState, useEffect } from 'react';
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
} from 'reactstrap';

export default function PumpStatusForm({ isOpen, toggle, initialData }) {
  const [formData, setFormData] = useState({
    bombNumber: '',
    servedQuantity: '',
    employeeName: '',
    status: '1',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bombNumber: initialData.bombNumber,
        servedQuantity: initialData.servedQuantity,
        employeeName: initialData.employeeInCharge.employeeName,
        status: String(initialData.status),
      });
    } else {
      setFormData({
        bombNumber: '',
        servedQuantity: '',
        employeeName: '',
        status: '1',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Datos enviados:", formData);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {initialData ? 'Editar Bomba' : 'Nueva Bomba'}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Número de Bomba</Label>
            <Input
              name="bombNumber"
              value={formData.bombNumber}
              onChange={handleChange}
              type="number"
            />
          </FormGroup>
          <FormGroup>
            <Label>Cantidad Servida</Label>
            <Input
              name="servedQuantity"
              value={formData.servedQuantity}
              onChange={handleChange}
              type="number"
            />
          </FormGroup>
          <FormGroup>
            <Label>Encargado</Label>
            <Input
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Estado</Label>
            <Input name="status" type="select" value={formData.status} onChange={handleChange}>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
              <option value="2">Mantenimiento</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Guardar
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
