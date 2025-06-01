// src/Admin/Roles/RolList.js

import React from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faIdCard } from "@fortawesome/free-solid-svg-icons";

export default function RolList({ roles, onEdit, onDelete, busqueda, setBusqueda }) {
  // Filtrado por nombre, descripción o id
  const rolesFiltrados = Array.isArray(roles)
    ? roles.filter(
        (r) =>
          (r.nombre && r.nombre.toLowerCase().includes((busqueda || "").toLowerCase())) ||
          (r.descripcion && r.descripcion.toLowerCase().includes((busqueda || "").toLowerCase())) ||
          (r.id && r.id.toString().includes(busqueda || ""))
      )
    : [];

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Roles</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar rol..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  style={{ maxWidth: "300px", marginRight: "10px" }}
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table className="align-items-center table-flush" bordered responsive hover>
              <thead className="thead-light">
                <tr>
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> #</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Salario</th>
                  <th>ID Rol Superior</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rolesFiltrados.length > 0 ? (
                  rolesFiltrados.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td> {/* Número secuencial de la fila */}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No se encontraron roles
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}