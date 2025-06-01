// src/Admin/Areas/AreaList.js
import React, { useState } from "react";
import {
  Table,
  Card,
  CardHeader,
  Row,
  Col,
  Button,
  Input,
  CardBody,
} from "reactstrap";
import { faEdit, faTrashAlt, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AreaList({ areas = [], onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const areasFiltradas = areas.filter(
    (a) =>
      (a.nombre && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.id && a.id.toString().includes(busqueda))
  );

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Áreas</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar área..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ maxWidth: "300px" }}
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table className="align-items-center table-flush" responsive hover>
              <thead className="thead-light">
                <tr>
                  <th>
                    <FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID
                  </th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>ID Servicio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {areasFiltradas.length > 0 ? (
                  areasFiltradas.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.id}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.id_servicio}</td>
                      <td>
                        <Button
                          size="sm"
                          color="info"
                          onClick={() => onEditar(item)}
                          className="mr-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => onEliminar(item)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No se encontraron áreas
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