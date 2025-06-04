//src/Payment/MetodosPago/// MetodoPagoDetail.js
import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function MetodoPagoDetail({ isOpen, toggle, metodo }) {
  if (!metodo) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Detalle del Método de Pago</ModalHeader>
      <ModalBody>
        <p><strong>ID:</strong> {metodo.idMetodo}</p>
        <p><strong>Método:</strong> {metodo.Metodo}</p>
        <p><strong>Estado:</strong> {metodo.estado ? "Activo" : "Eliminado"}</p>
      </ModalBody>
    </Modal>
  );
}