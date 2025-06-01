// src/gasoline/Deposits/DepositList.js
import React from 'react';
import { Table, Button, Badge, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DepositList({ deposits, onEdit, onDelete, onClose }) {
  return (
    <>
      <ModalHeader toggle={onClose}>Listado de Depósitos</ModalHeader>
      <ModalBody>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Combustible</th>
              <th>Capacidad Máxima</th>
              <th>Cantidad Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((d, index) => (
              <tr key={index}>
                <td><Badge color="info">{d.fuel.fuelName}</Badge></td>
                <td>{d.maxCapacity}</td>
                <td>{d.actualQuantity}</td>
                <td>
                  <Button size="sm" color="info" onClick={() => onEdit(d)} className="mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button size="sm" color="danger" onClick={() => onDelete(d.generalDepositId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </>
  );
}
