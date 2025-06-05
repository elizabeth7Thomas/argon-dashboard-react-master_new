import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default function SaleDetailsModal({ isOpen, toggle, sale }) {
  if (!sale) return null;

  const {
    fuel,
    bomb,
    customer,
    consumedQuantity,
    amount,
    status,
    paymentMethods,
    createdAt,
    paymentServiceMessage,
    createdBy,
    updatedBy,
  } = sale;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Detalles de la Venta</ModalHeader>
      <ModalBody>
        <ListGroup>
          {fuel?.fuelName && (
            <ListGroupItem>
              <strong>Combustible:</strong> {fuel.fuelName}
            </ListGroupItem>
          )}
          {bomb?.bombNumber && (
            <ListGroupItem>
              <strong>Bomba:</strong> {bomb.bombNumber}
            </ListGroupItem>
          )}
          {customer?.nit && (
            <ListGroupItem>
              <strong>NIT Cliente:</strong> {customer.nit}
            </ListGroupItem>
          )}
          {consumedQuantity && (
            <ListGroupItem>
              <strong>Cantidad:</strong> {Number(consumedQuantity).toFixed(4)} galones
            </ListGroupItem>
          )}
          {amount && (
            <ListGroupItem>
              <strong>Monto:</strong> ${Number(amount).toFixed(2)}
            </ListGroupItem>
          )}
          {status && (
            <ListGroupItem>
              <strong>Estado:</strong> {status}
            </ListGroupItem>
          )}
          {createdAt && (
            <ListGroupItem>
              <strong>Fecha:</strong> {new Date(createdAt).toLocaleString()}
            </ListGroupItem>
          )}
          {paymentServiceMessage && (
            <ListGroupItem>
              <strong>Mensaje Servicio Pagos</strong> {paymentServiceMessage}
            </ListGroupItem>
          )}
          {paymentMethods?.length > 0 && (
            <ListGroupItem>
              <strong>Métodos de Pago:</strong>
              <ul>
                {paymentMethods.map((p, idx) => (
                  <li key={idx}>
                    ID: {p.paymentId}, Monto: ${Number(p.amount).toFixed(2)}
                    {p.bankId && `, Banco: ${p.bankId}`}
                    {p.cardNumber && `, Tarjeta: ${p.cardNumber}`}
                  </li>
                ))}
              </ul>
            </ListGroupItem>
          )}
          {createdBy?.employeeName && (
            <ListGroupItem>
              <strong>Creado por:</strong> {createdBy.employeeName}
            </ListGroupItem>
          )}

          {updatedBy?.employeeName && (
            <ListGroupItem>
              <strong>Última modificación por:</strong> {updatedBy.employeeName}
            </ListGroupItem>
          )}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
