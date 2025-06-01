// src/Admin/Servicios/ServicioList.js
import React, { useState } from "react";
import {
  Table,
  Card,
  CardHeader,
  Row,
  Col,
  Input,
  CardBody,
} from "reactstrap";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ServicioList({ servicios = [] }) {
  const [busqueda, setBusqueda] = useState("");

  if (!Array.isArray(servicios)) return null;

  const serviciosFiltrados = servicios.filter(
    (s) =>
      (s.nombre && s.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (s.descripcion && s.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (s.id && s.id.toString().includes(busqueda))
  );

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Servicios</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar servicio..."
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
                </tr>
              </thead>
              <tbody>
                {serviciosFiltrados.length > 0 ? (
                  serviciosFiltrados.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.id}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No se encontraron servicios
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