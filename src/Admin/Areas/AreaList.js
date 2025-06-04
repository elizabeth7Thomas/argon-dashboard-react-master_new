// src/Admin/Areas/AreaList.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  CardHeader,
  Row,
  Col,
  Button,
  Input,
  CardBody,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { faEdit, faTrashAlt, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function AreaList({ onEditar, onEliminar }) {
  const [areas, setAreas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  // Paginación
  const [pagina, setPagina] = useState(1);
  const porPagina = 15;

  const catalogoServicios = JSON.parse(localStorage.getItem("catalogo_servicios") || "[]");

  const getServicioNombre = (id) => {
    const servicio = catalogoServicios.find(s => s.id === id || s.id === Number(id));
    return servicio ? servicio.nombre : id;
  };

  useEffect(() => {
    const fetchAreas = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró un token de autenticación");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "administracion/GET/areas" },
            request: {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Imprime toda la respuesta para depuración
        console.log("Respuesta completa del broker (áreas):", response.data);

        // Ajuste para la estructura esperada
        if (
          response.data?.response?.data?.areas &&
          Array.isArray(response.data.response.data.areas)
        ) {
          console.log("Áreas extraídas:", response.data.response.data.areas);
          setAreas(response.data.response.data.areas);
        } else if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Áreas extraídas (data):", response.data.response.data.data);
          setAreas(response.data.response.data.data);
        } else {
          console.log("Contenido de response.data.response.data:", response.data?.response?.data);
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
    fetchAreas();
  }, []);

  const handleEliminar = async (area) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta área?")) return;
    setAlert(null);
    const token = localStorage.getItem("token");
    const uri = `administracion/PATCH/areas/${area.id}`;
    const payload = {
      metadata: { uri },
      request: {}
    };
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const brokerResponse = response.data?.response?.data;
      const brokerMsg = response.data?.response?._broker_message;
      const brokerStatus = response.data?.response?._broker_status;
      if (brokerMsg || brokerResponse?.message) {
        setAlert(
          <div style={{ color: "#fff" }}>
            {brokerResponse?.message && (
              <>
                <strong>{brokerResponse.message}</strong>
                <br />
              </>
            )}
            {brokerMsg && <span>{brokerMsg}</span>}
            {brokerStatus && (
              <>
                <br />
                <span>Código: {brokerStatus}</span>
              </>
            )}
          </div>
        );
      }
      // Refresca la lista después de eliminar
      setAreas(prev => prev.filter(a => a.id !== area.id));
    } catch (error) {
      let brokerMsg = "";
      let brokerStatus = "";
      let brokerError = "";
      let brokerPath = "";
      let brokerTimestamp = "";
      if (error.response) {
        const resp = error.response.data?.response;
        brokerMsg = resp?._broker_message;
        brokerStatus = resp?._broker_status;
        brokerError = resp?.data?.error;
        brokerPath = resp?.data?.path;
        brokerTimestamp = resp?.data?.timestamp;
        setAlert(
          <div style={{ color: "#fff" }}>
            <strong>Error del broker:</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
            {brokerStatus && (
              <>
                <br />
                <span>Código: {brokerStatus}</span>
              </>
            )}
            {brokerError && (
              <>
                <br />
                <span>Detalle: {brokerError}</span>
              </>
            )}
            {brokerPath && (
              <>
                <br />
                <span>Ruta: {brokerPath}</span>
              </>
            )}
            {brokerTimestamp && (
              <>
                <br />
                <span>Fecha: {brokerTimestamp}</span>
              </>
            )}
          </div>
        );
      } else if (error.request) {
        setAlert(<span style={{ color: "#fff" }}>No hubo respuesta del servidor. Revisa tu conexión.</span>);
      } else {
        setAlert(<span style={{ color: "#fff" }}>{error.message || "Error desconocido."}</span>);
      }
    }
  };

  // Filtrado y paginación
  const areasFiltradas = areas.filter(
    (a) =>
      (a.nombre && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.id && a.id.toString().includes(busqueda))
  );

  const totalPaginas = Math.ceil(areasFiltradas.length / porPagina);
  const areasPagina = areasFiltradas.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  const irPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPagina(num);
  };

  useEffect(() => {
    setPagina(1);
  }, [busqueda]);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{error}</pre>
      </div>
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
            {alert && (
              <div style={{ background: "#dc3545", borderRadius: 4, padding: 12, margin: 10, color: "#fff" }}>
                {alert}
              </div>
            )}
            <Table className="align-items-center table-flush" responsive hover>
              <thead className="thead-light">
                <tr>
                  <th>
                    <FontAwesomeIcon icon={faIdCard} className="mr-1" /> #
                  </th>
                  <th>Nombre del área</th>
                  <th>Descripción</th>
                  <th>Servicio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {areasPagina.length > 0 ? (
                  areasPagina.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{(pagina - 1) * porPagina + index + 1}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                      <td>{getServicioNombre(item.id_servicio)}</td>
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
                          onClick={() => handleEliminar(item)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No se encontraron áreas
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}