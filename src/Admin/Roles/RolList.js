// src/Admin/Roles/RolList.js

import React from 'react';
import { Table, Button, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function RolList({ roles, onEdit, onDelete, onClose }) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return <p>No hay roles para mostrar.</p>;
  }
  return (
    <>
      <ModalHeader toggle={onClose}>Listado de Roles</ModalHeader>
      <ModalBody>
          <Table striped>
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Salario</th>
                <th>ID Rol Superior</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.salario}</td>
                    <td>{item.id_rol_superior}</td>
                    <td>
                      <Button size="sm" color="warning" onClick={() => onEdit(item)} className="mr-2">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button size="sm" color="danger" onClick={() => onDelete(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </Table>
      </ModalBody>
    </>
  );
}