import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function MetodoPagoDetail({ isOpen, toggle, metodo }) {
  if (!metodo) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Detalle del Método de Pago</ModalHeader>
      <ModalBody>
        <p><strong>Método:</strong> {metodo.Metodo}</p>
      </ModalBody>
    </Modal>
  );
}
