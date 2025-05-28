import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function TransaccionDetail({ isOpen, toggle, transaccion }) {
  if (!transaccion) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Detalle de Transacción</ModalHeader>
      <ModalBody>
        <p><strong>Cliente:</strong> {transaccion.Cliente}</p>
        <p><strong>Método de Pago:</strong> {transaccion.MetodoPago}</p>
        <p><strong>Monto:</strong> Q{transaccion.Monto}</p>
        <p><strong>Fecha:</strong> {transaccion.Fecha}</p>
      </ModalBody>
    </Modal>
  );
}
