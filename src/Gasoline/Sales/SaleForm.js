// src/Gasoline/Sales/SaleForm.js
/*import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';

export default function SaleForm({
  isOpen, toggle, onSubmit,
  formData, setFormData, isEditing
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Venta" : "Nueva Venta"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="producto">Producto</Label>
            <Input
              id="producto"
              name="producto"
              type="text"
              placeholder="Ej: Gasolina Premium"
              value={formData.producto}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="cantidad">Cantidad (L)</Label>
            <Input
              id="cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="Cantidad vendida"
            />
          </FormGroup>

          <FormGroup>
            <Label for="fecha">Fecha</Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="monto">Monto ($)</Label>
            <Input
              id="monto"
              name="monto"
              type="number"
              value={formData.monto}
              onChange={handleChange}
              placeholder="Monto total"
            />
          </FormGroup>

          <ModalFooter>
            <Button color="secondary" onClick={toggle}>Cancelar</Button>
            <Button color="success" type="submit">
              {isEditing ? "Guardar Cambios" : "Guardar"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
}*/

// SaleForm.js
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function SaleForm({
  isOpen,
  toggle,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  metodosPago = [],
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditing ? 'Editar Venta' : 'Registrar Venta'}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="producto">Producto</Label>
            <Input name="producto" value={formData.producto} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label for="cantidad">Cantidad</Label>
            <Input name="cantidad" value={formData.cantidad} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label for="monto">Monto</Label>
            <Input name="monto" value={formData.monto} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label for="fecha">Fecha</Label>
            <Input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label for="metodoPago">Método de Pago</Label>
            <Input type="select" name="metodoPago" value={formData.metodoPago} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {metodosPago.map((mp) => (
                <option key={mp.idMetodo} value={mp.idMetodo}>
                  {mp.Metodo}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Guardar
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
