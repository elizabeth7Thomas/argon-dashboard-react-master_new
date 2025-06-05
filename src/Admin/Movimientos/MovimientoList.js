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
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const filtros = [
  { label: "Todos", value: "GET_ALL" },
  { label: "Diario", value: "GET_DIARIO" },
  { label: "Mensual", value: "GET_MENSUAL" },
  { label: "Trimestral", value: "GET_TRIMESTRAL" },
  { label: "Semestral", value: "GET_SEMESTRAL" },
  { label: "Anual", value: "GET_ANUAL" },
];

const uris = {
  GET_ALL: "administracion/GET/movimientos",
  GET_DIARIO: "administracion/GET/movimientos/diarios",
  GET_MENSUAL: "administracion/GET/movimientos/mensuales",
  GET_TRIMESTRAL: "administracion/GET/movimientos/trimestrales",
  GET_SEMESTRAL: "administracion/GET/movimientos/semestrales",
  GET_ANUAL: "administracion/GET/movimientos/anuales",
};

export default function MovimientoList() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("GET_ALL");
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;

  // Parámetros de filtrado
  const [fechaDia, setFechaDia] = useState("");
  const [fechaMes, setFechaMes] = useState("");
  const [anio, setAnio] = useState("");
  const [numeroTrimestre, setNumeroTrimestre] = useState("");
  const [numeroSemestre, setNumeroSemestre] = useState("");
  const [servicioId, setServicioId] = useState("");

  useEffect(() => {
    const fetchMovimientos = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró un token de autenticación");
        setLoading(false);
        return;
      }
      try {
        let metadata = { uri: uris[filtro] };
        let request = {};

        // Parámetros según filtro
        if (filtro === "GET_DIARIO") {
          if (fechaDia) request.fecha_dia = fechaDia;
          if (servicioId) request.id_servicio = servicioId;
        } else if (filtro === "GET_MENSUAL") {
          if (fechaMes) request.fecha_mes = fechaMes;
          if (anio) request.año = anio;
          if (servicioId) request.id_servicio = servicioId;
        } else if (filtro === "GET_TRIMESTRAL") {
          if (numeroTrimestre) request.numero_trimestre = numeroTrimestre;
          if (anio) request.año = anio;
          if (servicioId) request.id_servicio = servicioId;
        } else if (filtro === "GET_SEMESTRAL") {
          if (numeroSemestre) request.numero_semestre = numeroSemestre;
          if (anio) request.año = anio;
          if (servicioId) request.id_servicio = servicioId;
        } else if (filtro === "GET_ANUAL") {
          if (anio) request.año = anio;
          if (servicioId) request.id_servicio = servicioId;
        }

        const response = await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          { metadata, request },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Imprime toda la respuesta para depuración
        console.log("Respuesta completa del broker (movimientos):", response.data);

        // Ajuste para la estructura esperada
        const data = response.data?.response?.data;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          // Unir todos los movimientos de todas las categorías
          let todosMovimientos = [];
          Object.values(data).forEach(cat => {
            if (cat && Array.isArray(cat.movimientos)) {
              todosMovimientos = todosMovimientos.concat(cat.movimientos);
            }
          });
          setMovimientos(todosMovimientos);
        } else if (
          data?.movimientos &&
          Array.isArray(data.movimientos)
        ) {
          setMovimientos(data.movimientos);
        } else if (
          Array.isArray(data)
        ) {
          setMovimientos(data);
        } else {
          setError("La respuesta del broker no tiene datos válidos");
        }
      } catch (err) {
        let errorMsg = "Error al conectar con el broker";
        if (err.response) {
          errorMsg = `Error ${err.response.status}: ${err.response.statusText}`;
          if (err.response.data) {
            errorMsg += `\nMensaje backend: ${JSON.stringify(err.response.data)}`;
          }
        } else if (err.request) {
          errorMsg = "No hubo respuesta del servidor. Revisa la conexión o la URL.";
        } else if (err.message) {
          errorMsg = err.message;
        }
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchMovimientos();
    // eslint-disable-next-line
  }, [filtro, fechaDia, fechaMes, anio, numeroTrimestre, numeroSemestre, servicioId]);

  // Filtrado por cualquier campo
  const movimientosFiltrados = movimientos.filter((m) => {
    const matchBusqueda = Object.values(m)
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return matchBusqueda;
  });

  // Paginación
  const totalPaginas = Math.ceil(movimientosFiltrados.length / porPagina);
  const movimientosPagina = movimientosFiltrados.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  // Cambiar de página
  const irPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPagina(num);
  };

  // Reiniciar página al cambiar filtro o búsqueda
  useEffect(() => {
    setPagina(1);
  }, [busqueda, filtro, fechaDia, fechaMes, anio, numeroTrimestre, numeroSemestre, servicioId]);

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col md={3}>
                <h3 className="mb-0">Listado de Movimientos</h3>
              </Col>
              <Col md={2}>
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
              {filtro === "GET_DIARIO" && (
                <Col md={2}>
                  <FormGroup>
                    <Label for="fechaDia">Fecha:</Label>
                    <Input
                      type="date"
                      id="fechaDia"
                      value={fechaDia}
                      onChange={e => setFechaDia(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              )}
              {filtro === "GET_MENSUAL" && (
                <>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="fechaMes">Mes:</Label>
                      <Input
                        type="month"
                        id="fechaMes"
                        value={fechaMes}
                        onChange={e => setFechaMes(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="anio">Año:</Label>
                      <Input
                        type="number"
                        id="anio"
                        value={anio}
                        onChange={e => setAnio(e.target.value)}
                        placeholder="Ej: 2025"
                      />
                    </FormGroup>
                  </Col>
                </>
              )}
              {filtro === "GET_TRIMESTRAL" && (
                <>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="numeroTrimestre">Trimestre:</Label>
                      <Input
                        type="number"
                        id="numeroTrimestre"
                        value={numeroTrimestre}
                        onChange={e => setNumeroTrimestre(e.target.value)}
                        min={1}
                        max={4}
                        placeholder="1-4"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="anio">Año:</Label>
                      <Input
                        type="number"
                        id="anio"
                        value={anio}
                        onChange={e => setAnio(e.target.value)}
                        placeholder="Ej: 2025"
                      />
                    </FormGroup>
                  </Col>
                </>
              )}
              {filtro === "GET_SEMESTRAL" && (
                <>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="numeroSemestre">Semestre:</Label>
                      <Input
                        type="number"
                        id="numeroSemestre"
                        value={numeroSemestre}
                        onChange={e => setNumeroSemestre(e.target.value)}
                        min={1}
                        max={2}
                        placeholder="1-2"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="anio">Año:</Label>
                      <Input
                        type="number"
                        id="anio"
                        value={anio}
                        onChange={e => setAnio(e.target.value)}
                        placeholder="Ej: 2025"
                      />
                    </FormGroup>
                  </Col>
                </>
              )}
              {filtro === "GET_ANUAL" && (
                <Col md={2}>
                  <FormGroup>
                    <Label for="anio">Año:</Label>
                    <Input
                      type="number"
                      id="anio"
                      value={anio}
                      onChange={e => setAnio(e.target.value)}
                      placeholder="Ej: 2025"
                    />
                  </FormGroup>
                </Col>
              )}
              <Col md={2}>
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
            {loading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong>
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{error}</pre>
              </div>
            ) : (
              <>
                <Table className="align-items-center table-flush" responsive hover>
                  <thead className="thead-light">
                    <tr>
                      <th>
                        <FontAwesomeIcon icon={faIdCard} className="mr-1" /> #
                      </th>
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
                    {movimientosPagina.length > 0 ? (
                      movimientosPagina.map((item, index) => (
                        <tr key={index}>
                          <td>{(pagina - 1) * porPagina + index + 1}</td> {/* Número sucesivo */}
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
                        <td colSpan="8" className="text-center text-muted py-4">
                          No se encontraron movimientos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {/* Paginación */}
                {totalPaginas > 1 && (
                  <Pagination className="justify-content-center mt-3">
                    <PaginationItem disabled={pagina === 1}>
                      <PaginationLink first onClick={() => irPagina(1)} />
                    </PaginationItem>
                    <PaginationItem disabled={pagina === 1}>
                      <PaginationLink previous onClick={() => irPagina(pagina - 1)} />
                    </PaginationItem>
                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <PaginationItem active={pagina === i + 1} key={i}>
                        <PaginationLink onClick={() => irPagina(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={pagina === totalPaginas}>
                      <PaginationLink next onClick={() => irPagina(pagina + 1)} />
                    </PaginationItem>
                    <PaginationItem disabled={pagina === totalPaginas}>
                      <PaginationLink last onClick={() => irPagina(totalPaginas)} />
                    </PaginationItem>
                  </Pagination>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}