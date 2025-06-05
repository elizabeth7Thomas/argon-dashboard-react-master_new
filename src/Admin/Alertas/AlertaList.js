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
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faTrashAlt, faIdCard, faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AlertaList({ onEditar, onEliminar, onAgregar }) {
  const [alertas, setAlertas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [idServicioFiltro, setIdServicioFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // "", "activo", "inactivo"
  const [alert, setAlert] = useState(null);

  const POR_PAGINA = 15;

  // Cargar catálogo de servicios desde localStorage
  const catalogoServicios = JSON.parse(localStorage.getItem("catalogo_servicios") || "[]");

  // Helper para mostrar el nombre del servicio
  const getServicioNombre = (id) => {
    const servicio = catalogoServicios.find(s => s.id === id || s.id === Number(id));
    return servicio ? servicio.nombre : id;
  };

  useEffect(() => {
    const fetchAlertas = async () => {
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
            metadata: { uri: "administracion/GET/alertas" },
            request: {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (
          response.data?.response?.data?.alertas &&
          Array.isArray(response.data.response.data.alertas)
        ) {
          setAlertas(response.data.response.data.alertas);
        } else if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          setAlertas(response.data.response.data.data);
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
    fetchAlertas();
  }, []);

  // Filtros
  const alertasFiltradas = alertas.filter((a) => {
    const coincideBusqueda =
      (!busqueda ||
        (a.nombre_producto && a.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())) ||
        (a.mensaje && a.mensaje.toLowerCase().includes(busqueda.toLowerCase())) ||
        (a.id && a.id.toString().includes(busqueda)));
    const coincideServicio =
      !idServicioFiltro || (a.id_servicio && String(a.id_servicio) === idServicioFiltro);
    const coincideEstado =
      !estadoFiltro ||
      (estadoFiltro === "activo" && a.estado === true) ||
      (estadoFiltro === "inactivo" && a.estado === false);
    return coincideBusqueda && coincideServicio && coincideEstado;
  });

  // Paginación
  const totalPaginas = Math.ceil(alertasFiltradas.length / POR_PAGINA);
  const alertasPagina = alertasFiltradas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  // Si cambian los filtros o búsqueda, vuelve a la página 1
  useEffect(() => {
    setPagina(1);
  }, [busqueda, idServicioFiltro, estadoFiltro]);

  // Paginación mejorada
  const renderPagination = () => {
    if (totalPaginas <= 1) return null;

    const paginasVisibles = 3;
    let start = Math.max(1, pagina - paginasVisibles);
    let end = Math.min(totalPaginas, pagina + paginasVisibles);

    if (pagina <= paginasVisibles) {
      end = Math.min(totalPaginas, paginasVisibles * 2 + 1);
    }
    if (pagina > totalPaginas - paginasVisibles) {
      start = Math.max(1, totalPaginas - paginasVisibles * 2);
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination className="mt-3 justify-content-center">
        <PaginationItem disabled={pagina === 1}>
          <PaginationLink first onClick={() => setPagina(1)}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={pagina === 1}>
          <PaginationLink previous onClick={() => setPagina(pagina - 1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </PaginationLink>
        </PaginationItem>
        {pageNumbers.map((num) => (
          <PaginationItem active={pagina === num} key={num}>
            <PaginationLink onClick={() => setPagina(num)}>
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={pagina === totalPaginas}>
          <PaginationLink next onClick={() => setPagina(pagina + 1)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={pagina === totalPaginas}>
          <PaginationLink last onClick={() => setPagina(totalPaginas)}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    );
  };

  // Eliminar alerta con manejo de mensajes del broker
  const handleEliminar = async (alerta) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta alerta?")) return;
    setAlert(null);
    const token = localStorage.getItem("token");
    const uri = `administracion/PATCH/alertas/${alerta.id}`;
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
      setAlertas(prev => prev.filter(a => a.id !== alerta.id));
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

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Alertas", 10, 10);
    doc.autoTable({
      head: [["ID", "Producto", "Mensaje", "Servicio", "Estado"]],
      body: alertasFiltradas.map(a => [
        a.id,
        a.nombre_producto,
        a.mensaje,
        getServicioNombre(a.id_servicio),
        a.estado === true ? "Activo" : "Inactivo"
      ]),
      startY: 20
    });
    doc.save("alertas.pdf");
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const data = alertasFiltradas.map(a => ({
      ID: a.id,
      Producto: a.nombre_producto,
      Mensaje: a.mensaje,
      Servicio: getServicioNombre(a.id_servicio),
      Estado: a.estado === true ? "Activo" : "Inactivo"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alertas");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "alertas.xlsx");
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{error}</pre>
      </div>
    );

  return (
    <>
      {alert && (
        <div style={{ background: "#dc3545", borderRadius: 4, padding: 12, margin: 10, color: "#fff" }}>
          {alert}
        </div>
      )}
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0">Listado de Alertas</h3>
                </Col>
                <Col className="d-flex justify-content-end align-items-center">
                  <Button color="danger" className="mr-2" onClick={exportToPDF}>
                    <FontAwesomeIcon icon={faFilePdf} className="mr-1" /> PDF
                  </Button>
                  <Button color="success" className="mr-2" onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faFileExcel} className="mr-1" /> Excel
                  </Button>
                  <Input
                    type="text"
                    placeholder="Buscar alerta..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ maxWidth: "200px", marginRight: 8 }}
                  />
                  <Input
                    type="select"
                    value={idServicioFiltro}
                    onChange={(e) => setIdServicioFiltro(e.target.value)}
                    style={{ maxWidth: "180px", marginRight: 8 }}
                  >
                    <option value="">Todos los servicios</option>
                    {catalogoServicios.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </Input>
                  <Input
                    type="select"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    style={{ maxWidth: "120px" }}
                    className="mr-2"
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </Input>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Table className="align-items-center table-flush" responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID</th>
                    <th>Producto</th>
                    <th>Mensaje</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {alertasPagina.length > 0 ? (
                    alertasPagina.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>{item.id}</td>
                        <td>{item.nombre_producto}</td>
                        <td>{item.mensaje}</td>
                        <td>{getServicioNombre(item.id_servicio)}</td>
                        <td>
                          {item.estado === true
                            ? <span className="text-success font-weight-bold">Activo</span>
                            : <span className="text-danger font-weight-bold">Inactivo</span>
                          }
                        </td>
                        <td>
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
                      <td colSpan="6" className="text-center text-muted py-4">
                        No se encontraron alertas
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* Paginación */}
              {renderPagination()}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}