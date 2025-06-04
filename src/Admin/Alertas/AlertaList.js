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
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faEdit, faTrashAlt, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function AlertaList({ onEditar, onEliminar }) {
  const [alertas, setAlertas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [idServicioFiltro, setIdServicioFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // "", "activo", "inactivo"

  const POR_PAGINA = 15;

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

        // Imprime toda la respuesta para depuración
        console.log("Respuesta completa del broker (alertas):", response.data);

        // Imprime el posible array de alertas para ver la estructura real
        if (
          response.data?.response?.data?.alertas &&
          Array.isArray(response.data.response.data.alertas)
        ) {
          console.log("Alertas extraídas:", response.data.response.data.alertas);
          setAlertas(response.data.response.data.alertas);
        } else if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Alertas extraídas:", response.data.response.data.data);
          setAlertas(response.data.response.data.data);
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
      !idServicioFiltro || (a.id_servicio && a.id_servicio.toString() === idServicioFiltro);
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

    const paginasVisibles = 3; // Cuántos botones de página mostrar a la izquierda y derecha
    let start = Math.max(1, pagina - paginasVisibles);
    let end = Math.min(totalPaginas, pagina + paginasVisibles);

    // Ajusta el rango si estás cerca del inicio o fin
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
                <h3 className="mb-0">Listado de Alertas</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar alerta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ maxWidth: "200px", marginRight: 8 }}
                />
                <Input
                  type="text"
                  placeholder="ID Servicio"
                  value={idServicioFiltro}
                  onChange={(e) => setIdServicioFiltro(e.target.value)}
                  style={{ maxWidth: "120px", marginRight: 8 }}
                />
                <Input
                  type="select"
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  style={{ maxWidth: "120px" }}
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
                  <th>ID Servicio</th>
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
                      <td>{item.id_servicio}</td>
                      <td>
                        {item.estado === true
                          ? <span className="text-success font-weight-bold">Activo</span>
                          : <span className="text-danger font-weight-bold">Inactivo</span>
                        }
                      </td>
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
  );
}