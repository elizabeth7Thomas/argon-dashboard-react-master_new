// src/payment/Clientes/ClienteDetail.js
import React from "react";
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from "reactstrap";

export default function ClienteDetail({ isOpen, toggle, cliente }) {
  if (!cliente) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Detalle del Cliente</ModalHeader>
      <ModalBody>
        <ListGroup>
          <ListGroupItem><strong>Nombre:</strong> {cliente.nombre}</ListGroupItem>
          <ListGroupItem><strong>Email:</strong> {cliente.email}</ListGroupItem>
          <ListGroupItem><strong>Teléfono:</strong> {cliente.telefono}</ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
}
