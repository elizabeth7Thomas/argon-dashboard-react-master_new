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

export default function ProveedorList({ proveedores = [], onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      ((p.nombres + " " + p.apellidos).toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.telefono && p.telefono.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.nit && p.nit.toString().includes(busqueda)) ||
      (p.id && p.id.toString().includes(busqueda))
  );

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Proveedores</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar proveedor..."
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
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Teléfono</th>
                  <th>NIT</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedoresFiltrados.length > 0 ? (
                  proveedoresFiltrados.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.id}</td>
                      <td>{item.nombres}</td>
                      <td>{item.apellidos}</td>
                      <td>{item.telefono}</td>
                      <td>{item.nit}</td>
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
                    <td colSpan="6" className="text-center text-muted py-4">
                      No se encontraron proveedores
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