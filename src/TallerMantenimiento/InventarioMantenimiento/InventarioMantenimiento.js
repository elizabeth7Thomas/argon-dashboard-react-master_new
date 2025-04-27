import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Table
} from 'reactstrap';
import HeaderMantenimiento from 'components/Headers/HeaderMantenimiento';

const InventarioMantenimiento = () => {
  // Estado para el modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // Inventario de ejemplo (simula GET)
  const inventarios = [
    {
      idInventario: 3,
      cantidad: 25,
      fechaIngreso: "2025-03-01",
      existenciaMinima: 10,
      estado: 1,
      idProducto: 10
    }
  ];

  return (
    <>
    <HeaderMantenimiento />
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Inventario de Productos</h2>

      <Button color="primary" onClick={toggle} className="mb-4">
        ➕ Agregar Inventario
      </Button>

      {/* Tabla */}
      <Table bordered hover responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Cantidad</th>
            <th>Fecha Ingreso</th>
            <th>Existencia Mínima</th>
            <th>Estado</th>
            <th>ID Producto</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.map((inv) => (
            <tr key={inv.idInventario}>
              <td>{inv.idInventario}</td>
              <td>{inv.cantidad}</td>
              <td>{inv.fechaIngreso}</td>
              <td>{inv.existenciaMinima}</td>
              <td>{inv.estado === 1 ? 'Activo' : 'Inactivo'}</td>
              <td>{inv.idProducto}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar inventario */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Agregar Inventario</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="cantidad">Cantidad</Label>
            <Input type="number" id="cantidad" />
          </FormGroup>

          <FormGroup>
            <Label for="fechaIngreso">Fecha de Ingreso</Label>
            <Input type="date" id="fechaIngreso" />
          </FormGroup>

          <FormGroup>
            <Label for="existenciaMinima">Existencia Mínima</Label>
            <Input type="number" id="existenciaMinima" />
          </FormGroup>

          <FormGroup>
            <Label for="estado">Estado</Label>
            <Input type="select" id="estado">
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="idProducto">ID Producto</Label>
            <Input type="number" id="idProducto" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => alert("Inventario agregado con éxito")}>
            Guardar
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
    </>
  );
};

export default InventarioMantenimiento;
