// src/gasoline/Alerts/AlertList.js
import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Table, Badge
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AlertList({
  isOpen, toggle, alerts,
  onEdit, onDelete
}) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Listado de Alertas</ModalHeader>
      <ModalBody>
        <Table responsive bordered>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Mensaje</th>
              <th>Nivel</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alerta, index) => (
              <tr key={index}>
                <td>{alerta.tipo}</td>
                <td>{alerta.mensaje}</td>
                <td>
                  <Badge
                    color={
                      alerta.nivel === 'critica'
                        ? 'danger'
                        : alerta.nivel === 'advertencia'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    {alerta.nivel}
                  </Badge>
                </td>
                <td>
                  <Button color="info" size="sm" onClick={() => onEdit(alerta)} className="mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button color="danger" size="sm" onClick={() => onDelete(alerta)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
}
