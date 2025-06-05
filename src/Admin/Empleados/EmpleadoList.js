import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Input, Spinner, Alert, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faIdCard, faPhone, faEnvelope, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

export default function EmpleadoList({
  onEdit,
  onDelete // <-- Asegúrate de recibir onDelete si lo usas
}) {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerta, setAlerta] = useState(null);

  const [estadoFiltro, setEstadoFiltro] = useState(""); 
  const [jornadaFiltro, setJornadaFiltro] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 15;

  const catalogoJornadas = JSON.parse(localStorage.getItem("catalogo_jornadas") || "[]");
  const catalogoAreas = JSON.parse(localStorage.getItem("catalogo_areas") || "[]");
  const catalogoRoles = JSON.parse(localStorage.getItem("catalogo_roles") || "[]");

  useEffect(() => {
    const fetchEmpleados = async () => {
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
            metadata: {
              uri: "administracion/GET/empleados"
            },
            request: {}
          },
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }
        );
        if (
          response.data?.response?.data &&
          Array.isArray(response.data.response.data.empleados)
        ) {
          setEmpleados(response.data.response.data.empleados);
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
          if (
            err.response &&
            err.response.data &&
            err.response.data._broker_status === 401
          ) {
            setError("Sesión expirada o token inválido. Por favor, inicia sesión nuevamente.");
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
    fetchEmpleados();
  }, []);

  // Helpers para mostrar nombres
  const getJornadaNombre = (id) => {
    const jornada = catalogoJornadas.find(j => j.id === id || j.id === Number(id));
    return jornada ? jornada.nombre : id;
  };

  const getAreaNombre = (id) => {
    const area = catalogoAreas.find(a => a.id === id || a.id === Number(id));
    return area ? area.nombre : id;
  };

  const getRolNombre = (id) => {
    const rol = catalogoRoles.find(r => r.id === id || r.id === Number(id));
    return rol ? rol.nombre : id;
  };

  const empleadosFiltrados = empleados.filter((item) => {
    const activo = item.empleado.estado !== false;
    const coincideEstado =
      !estadoFiltro ||
      (estadoFiltro === "activo" && activo) ||
      (estadoFiltro === "inactivo" && !activo);

    const coincideJornada = !jornadaFiltro || item.empleado.id_jornada === Number(jornadaFiltro);

    const coincideArea = !areaFiltro || (item.asignacion && item.asignacion.id_area === Number(areaFiltro));

    const coincideBusqueda =
      (item.empleado.nombres + " " + item.empleado.apellidos).toLowerCase().includes((busqueda || "").toLowerCase()) ||
      (item.empleado.usuario || "").toLowerCase().includes((busqueda || "").toLowerCase()) ||
      (item.empleado.id ? item.empleado.id.toString() : "").includes(busqueda || "");

    return coincideEstado && coincideJornada && coincideArea && coincideBusqueda;
  });

  const totalPaginas = Math.ceil(empleadosFiltrados.length / POR_PAGINA);
  const empleadosPagina = empleadosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, estadoFiltro, jornadaFiltro, areaFiltro]);

  const handleDelete = async (empleadoId) => {
    const token = localStorage.getItem("token");
    const uri = `administracion/PATCH/empleados/${empleadoId}`;
    const payload = {
      metadata: { uri },
      request: {}
    };

    setAlerta(null);

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const message = response.data?.response?.data?.message || "Empleado eliminado correctamente";
      const brokerMsg = response.data?.response?._broker_message;
      setAlerta({
        type: "success",
        text: (
          <>
            {message}
            {brokerMsg && (
              <>
                <br />
                <small className="text-muted">{brokerMsg}</small>
              </>
            )}
          </>
        )
      });

    } catch (error) {
      let msg = "Error desconocido.";
      let brokerMsg = "";
      if (error.response) {
        msg =
          error.response.data?.response?.data?.message ||
          error.response.data?.response?.data?.error ||
          error.response.data?.response?.data?.status ||
          error.response.data?.response?.data?.statusText ||
          error.response.data?.response?.data?.path ||
          error.response.data?.response?._broker_message ||
          error.response.data?.message ||
          error.response.data?.error ||
          `Error ${error.response.status}: ${error.response.statusText}`;
        brokerMsg = error.response.data?.response?._broker_message;
      } else if (error.request) {
        msg = "No hubo respuesta del servidor. Revisa tu conexión.";
      } else if (error.message) {
        msg = error.message;
      }
      setAlerta({
        type: "danger",
        text: (
          <>
            {msg}
            {brokerMsg && (
              <>
                <br />
                <small className="text-muted">{brokerMsg}</small>
              </>
            )}
          </>
        )
      });
    }
  };

  // Función para obtener la fecha y hora actual
  const getFecha = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };
  const getHora = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  };

  const [loadingId, setLoadingId] = useState(null);
  const [mensaje, setMensaje] = useState({});

  // Registrar entrada
  const registrarEntrada = async (item) => {
    setLoadingId(item.empleado.id);
    setMensaje({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        metadata: { uri: "administracion/POST/asistencias/" },
        request: {
          id_empleado: item.empleado.id,
          fecha: getFecha(),
          hora_entrada: getHora(),
        },
      };
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
      setMensaje({ [item.empleado.id]: response.data?.response?.data?.message || "Entrada registrada" });
    } catch (err) {
      setMensaje({ [item.empleado.id]: "Error al registrar entrada" });
    } finally {
      setLoadingId(null);
    }
  };

  // Registrar salida
  const registrarSalida = async (item) => {
    setLoadingId(item.empleado.id);
    setMensaje({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        metadata: { uri: "administracion/PATCH/asistencias/salida" },
        request: {
          id_empleado: item.empleado.id,
          fecha: getFecha(),
          hora_salida: getHora(),
        },
      };
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
      setMensaje({ [item.empleado.id]: response.data?.response?.data?.message || "Salida registrada" });
    } catch (err) {
      setMensaje({ [item.empleado.id]: "Error al registrar salida" });
    } finally {
      setLoadingId(null);
    }
  };

  const renderPagination = () => {
    if (totalPaginas <= 1) return null;
    const paginasVisibles = 2;
    let start = Math.max(1, pagina - paginasVisibles);
    let end = Math.min(totalPaginas, pagina + paginasVisibles);
    if (pagina <= paginasVisibles) end = Math.min(totalPaginas, paginasVisibles * 2 + 1);
    if (pagina > totalPaginas - paginasVisibles) start = Math.max(1, totalPaginas - paginasVisibles * 2);
    const pageNumbers = [];
    for (let i = start; i <= end; i++) pageNumbers.push(i);

    return (
      <Pagination className="mt-3 justify-content-center">
        <PaginationItem disabled={pagina === 1}>
          <PaginationLink first onClick={() => setPagina(1)} />
        </PaginationItem>
        <PaginationItem disabled={pagina === 1}>
          <PaginationLink previous onClick={() => setPagina(pagina - 1)} />
        </PaginationItem>
        {pageNumbers.map((num) => (
          <PaginationItem active={pagina === num} key={num}>
            <PaginationLink onClick={() => setPagina(num)}>
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={pagina === totalPaginas}>
          <PaginationLink next onClick={() => setPagina(pagina + 1)} />
        </PaginationItem>
        <PaginationItem disabled={pagina === totalPaginas}>
          <PaginationLink last onClick={() => setPagina(totalPaginas)} />
        </PaginationItem>
      </Pagination>
    );
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{error}</pre>
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Empleados</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar empleado..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  style={{ maxWidth: "200px", marginRight: "8px" }}
                />
                <Input
                  type="select"
                  value={estadoFiltro}
                  onChange={e => setEstadoFiltro(e.target.value)}
                  style={{ maxWidth: "120px", marginRight: "8px" }}
                >
                  <option value="">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </Input>
                <Input
                  type="select"
                  value={jornadaFiltro}
                  onChange={e => setJornadaFiltro(e.target.value)}
                  style={{ maxWidth: "120px", marginRight: "8px" }}
                >
                  <option value="">Todas las jornadas</option>
                  {catalogoJornadas.map(j => (
                    <option key={j.id} value={j.id}>{j.nombre}</option>
                  ))}
                </Input>
                <Input
                  type="select"
                  value={areaFiltro}
                  onChange={e => setAreaFiltro(e.target.value)}
                  style={{ maxWidth: "120px" }}
                >
                  <option value="">Todas las áreas</option>
                  {catalogoAreas.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </Input>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {alerta && (
              <Alert color={alerta.type} toggle={() => setAlerta(null)}>
                {alerta.text}
              </Alert>
            )}
            <Table className="align-items-center table-flush" bordered responsive hover>
              <thead className="thead-light">
                <tr>
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /></th>
                  <th>Nombre completo</th>
                  <th>DPI</th>
                  <th>NIT</th>
                  <th><FontAwesomeIcon icon={faPhone} className="mr-1" /> Teléfono</th>
                  <th><FontAwesomeIcon icon={faEnvelope} className="mr-1" /> Email</th>
                  <th><FontAwesomeIcon icon={faUser} className="mr-1" /> Usuario</th>
                  <th><FontAwesomeIcon icon={faClock} className="mr-1" /> Jornada</th>
                  <th>Área</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosPagina.length > 0 ? (
                  empleadosPagina.map((item, index) => (
                    <tr key={item.empleado.id || index}>
                      <td>{index + 1 + (pagina - 1) * POR_PAGINA}</td>
                      <td>{item.empleado.nombres} {item.empleado.apellidos}</td>
                      <td>{item.empleado.dpi}</td>
                      <td>{item.empleado.nit}</td>
                      <td>{item.empleado.telefono}</td>
                      <td>{item.empleado.email}</td>
                      <td>{item.empleado.usuario}</td>
                      <td>{getJornadaNombre(item.empleado.id_jornada)}</td>
                      <td>
                        {item.asignacion
                          ? (getAreaNombre(item.asignacion.id_area) || item.asignacion.id_area)
                          : <span className="text-muted">Sin asignación</span>
                        }
                      </td>
                      <td>
                        {item.asignacion
                          ? (getRolNombre(item.asignacion.id_rol) || item.asignacion.id_rol)
                          : <span className="text-muted">Sin asignación</span>
                        }
                      </td>
                      <td>
                        {item.empleado.estado === false
                          ? <span className="text-danger font-weight-bold">Inactivo</span>
                          : <span className="text-success font-weight-bold">Activo</span>
                        }
                      </td>
                      <td>
                        <Button size="sm" color="info" onClick={() => onEdit(item)} className="mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button size="sm" color="danger" onClick={() => handleDelete(item.empleado.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        {/* Toma de asistencia */}
                        <Button
                          color="success"
                          size="sm"
                          className="ml-2"
                          onClick={() => registrarEntrada(item)}
                          disabled={loadingId === item.empleado.id}
                        >
                          {loadingId === item.empleado.id ? <Spinner size="sm" /> : "Entrada"}
                        </Button>
                        <Button
                          color="warning"
                          size="sm"
                          className="ml-2"
                          onClick={() => registrarSalida(item)}
                          disabled={loadingId === item.empleado.id}
                        >
                          {loadingId === item.empleado.id ? <Spinner size="sm" /> : "Salida"}
                        </Button>
                        {mensaje[item.empleado.id] && (
                          <span style={{ fontSize: "0.85em", marginLeft: 8 }}>{mensaje[item.empleado.id]}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center text-muted py-4">
                      No se encontraron empleados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {renderPagination()}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
