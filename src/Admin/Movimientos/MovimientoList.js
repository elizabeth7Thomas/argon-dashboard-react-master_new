// src/Admin/Movimientos/MovimientoList.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  CardHeader,
  Row,
  Col,
  Input,
  CardBody,
  FormGroup,
  Label,
} from "reactstrap";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import routes from "../routes";

const filtros = [
  { label: "Diario", value: "GET_ALL_D" },
  { label: "Mensual", value: "GET_ALL_M" },
  { label: "Trimestral", value: "GET_ALL_T" },
  { label: "Semestral", value: "GET_ALL_S" },
  { label: "Anual", value: "GET_ALL_A" },
];

export default function MovimientoList() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("GET_ALL_D");
  const [movimientosPorCategoria, setMovimientosPorCategoria] = useState({});
  const [servicioId, setServicioId] = useState("");

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const url = routes.REPORTES_API[filtro];
        const res = await axios.get(url);
        setMovimientosPorCategoria(res.data || {});
      } catch (error) {
        setMovimientosPorCategoria({});
      }
    };
    fetchMovimientos();
  }, [filtro]);

  // Unifica todos los movimientos en un array plano con categoría
  const movimientosUnificados = [];
  Object.entries(movimientosPorCategoria).forEach(([categoria, data]) => {
    (data.movimientos || []).forEach((mov) => {
      movimientosUnificados.push({ ...mov, categoria });
    });
  });

  // Filtrado por cualquier campo
  const movimientosFiltrados = movimientosUnificados.filter((m) => {
    const matchBusqueda = Object.values(m)
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchServicio = servicioId ? String(m.id_servicio) === String(servicioId) : true;
    return matchBusqueda && matchServicio;
  });

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col md={4}>
                <h3 className="mb-0">Listado de Movimientos</h3>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="filtro">Filtrar por:</Label>
                  <Input
                    type="select"
                    id="filtro"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  >
                    {filtros.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="servicioId">ID Servicio:</Label>
                  <Input
                    type="number"
                    id="servicioId"
                    value={servicioId}
                    onChange={e => setServicioId(e.target.value)}
                    placeholder="Ej: 1"
                  />
                </FormGroup>
              </Col>
              <Col md={3} className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar movimiento..."
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
                    <FontAwesomeIcon icon={faIdCard} className="mr-1" /> #
                  </th>
                  <th>Categoría</th>
                  <th>Concepto</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                  <th>Servicio</th>
                  <th>Empleado</th>
                  <th>Producto</th>
                  <th>Nota Crédito</th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.length > 0 ? (
                  movimientosFiltrados.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.categoria}</td>
                      <td>{item.concepto}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.fecha_movimiento}</td>
                      <td>{item.id_servicio || ""}</td>
                      <td>{item.nombre_empleado || ""}</td>
                      <td>{item.producto || ""}</td>
                      <td>{item.notaCredito || ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      No se encontraron movimientos
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