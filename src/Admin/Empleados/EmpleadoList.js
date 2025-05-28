// src/Admin/Empleados/EmpleadoList.js
import React from 'react';
import { Table, Button, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function EmpleadoList({ empleados, onEdit, onDelete}) {
  if (!empleados.length) {
    return <p>No hay empleados para mostrar.</p>;
  }
  return (
    <>
      <ModalHeader>Listado de Empleados</ModalHeader>
      <ModalBody>
        <Table bordered responsive hover>
          <thead className="thead-light">
            <tr>
              <th>#</th>
              <th>Nombre completo</th>
              <th>DPI</th>
              <th>NIT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Usuario</th>
              <th>Área</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((item, index) => (
              <tr key={item.empleado.id || index}>
                <td>{item.empleado.id}</td>
                <td>{item.empleado.nombres} {item.empleado.apellidos}</td>
                <td>{item.empleado.dpi}</td>
                <td>{item.empleado.nit}</td>
                <td>{item.empleado.telefono}</td>
                <td>{item.empleado.email}</td>
                <td>{item.empleado.usuario}</td>
                <td>{item.asignacion.area}</td>
                <td>{item.asignacion.rol}</td>
                <td>
                  <Button size="sm" color="warning" onClick={() => onEdit(item)} className="mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button size="sm" color="danger" onClick={() => onDelete(item.empleado.id)}>
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
