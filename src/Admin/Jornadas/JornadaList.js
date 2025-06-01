import React, { useState } from "react";
import {
  Table,
  Card,
  CardHeader,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";
import {
  faEdit,
  faTrashAlt,
  faIdCard,
  faClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function JornadaList({
  jornadas = [],
  onEditar = () => {},
  onEliminar = () => {},
}) {
  const [busqueda, setBusqueda] = useState("");

  const jornadasFiltradas = jornadas.filter(
    (j) =>
      (j.nombre && j.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (j.descripcion && j.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (j.id && j.id.toString().includes(busqueda))
  );

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Jornadas</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar jornada..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ maxWidth: "300px" }}
                />
              </Col>
            </Row>
          </CardHeader>
          <Table className="align-items-center table-flush" responsive hover>
            <thead className="thead-light">
              <tr>
                <th>
                  <FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID
                </th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> Días laborales
                </th>
                <th>
                  <FontAwesomeIcon icon={faClock} className="mr-1" /> Entrada
                </th>
                <th>
                  <FontAwesomeIcon icon={faClock} className="mr-1" /> Salida
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jornadasFiltradas.length > 0 ? (
                jornadasFiltradas.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{Array.isArray(item.dias_laborales) ? item.dias_laborales.join(", ") : ""}</td>
                    <td>{item.hora_entrada}</td>
                    <td>{item.hora_salida}</td>
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
                  <td colSpan="7" className="text-center text-muted py-4">
                    No se encontraron jornadas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Col>
    </Row>
  );
}