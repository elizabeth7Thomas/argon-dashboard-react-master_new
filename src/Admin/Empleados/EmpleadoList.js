import React from 'react';
import { Table, Button, Badge, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function EmpleadoList({ empleados, onEdit, onDelete, onClose }) {
  return (
    <>
      <ModalHeader toggle={onClose}>Listado de Empleados</ModalHeader>
      <ModalBody>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Puesto</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((e, index) => (
              <tr key={index}>
                <td><Badge color="primary">{e.nombre}</Badge></td>
                <td>{e.apellido}</td>
                <td>{e.puesto}</td>
                <td>{e.correo}</td>
                <td>{e.telefono}</td>
                <td>
                  <Button size="sm" color="warning" onClick={() => onEdit(e)} className="mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button size="sm" color="danger" onClick={() => onDelete(e.id)}>
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