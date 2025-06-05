import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";

// Obtener el catálogo de estadosMovimiento del localStorage


// Función para mostrar el nombre del estadoMovimiento según el id

const OrdenDetalleModal = ({ isOpen, toggle, orden }) => {
  if (!orden) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Detalle de la Orden #{orden.id}
      </ModalHeader>
      <ModalBody>
        <p>
          <strong>Fecha de Orden:</strong> {orden.fecha_orden}
        </p>
        <p>
          <strong>Servicio:</strong> {orden.servicio?.nombre}
        </p>
        <p>
          <strong>Proveedor:</strong> {orden.proveedor?.nombres} {orden.proveedor?.apellidos}
        </p>
        <p>
          <strong>Teléfono:</strong> {orden.proveedor?.telefono}
        </p>
        <p>
          <strong>NIT:</strong> {orden.proveedor?.nit}
        </p>
        <p>
          <strong>Costo Total:</strong> ${orden.costo_total}
        </p>
        <p>
          <strong>Estado:</strong> {orden.estado_orden?.nombre}
        </p>
        <h5>Productos</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>ID Detalle</th>
              <th>ID Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Estado Detalle</th>
            </tr>
          </thead>
          <tbody>
            {orden.orden_detalles?.map((detalle) => (
              <tr key={detalle.id}>
                <td>{detalle.id}</td>
                <td>{detalle.id_producto}</td>
                <td>{detalle.cantidad}</td>
                <td>{detalle.precio_unitario}</td>
                <td>{orden.estado_orden?.nombre}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrdenDetalleModal;