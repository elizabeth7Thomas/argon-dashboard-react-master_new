import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  Spinner,
} from "reactstrap";
import OrdenForm from "./OrdenForm";
import OrdenDetalleModal from "./OrdenDetalleModal";
import { faEdit,  faIdCard, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";

const OrdenList = ({
  onVerDetalles,
  estadosDetalles,
}) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [alert, setAlert] = useState(null);
  const [detalleModalOpen, setDetalleModalOpen] = useState(false);
  const [ordenDetalle, setOrdenDetalle] = useState(null);

  // NUEVO: Estados para filtros de servicio y proveedor
  const [filtroServicio, setFiltroServicio] = useState("");
  const [filtroProveedor, setFiltroProveedor] = useState("");

  // Nuevo estado para el cambio de estado
  const [cambiarEstadoId, setCambiarEstadoId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  // Catálogos
  const catalogoServicios = JSON.parse(localStorage.getItem("catalogo_servicios") || "[]");
  const catalogoProveedores = JSON.parse(localStorage.getItem("catalogo_proveedores") || "[]");
  const catalogoEstadosMovimiento = JSON.parse(localStorage.getItem("catalogo_estadosMovimiento") || "[]");

  // Funciones para mostrar nombres
  const getServicioNombre = (id) => {
    const serv = catalogoServicios.find(s => Number(s.id) === Number(id));
    return serv ? serv.nombre : id;
  };
  // Función para mostrar el nombre del proveedor según el id de la tabla
  const getProveedorNombre = (id) => {
    const prov = catalogoProveedores.find(p => Number(p.id) === Number(id));
    return prov ? `${prov.nombres} ${prov.apellidos}` : "No encontrado";
  };
  // Función para mostrar el nombre del estadoMovimiento según el id
  const getEstadoMovimientoNombre = (id) => {
    const estado = catalogoEstadosMovimiento.find(e => Number(e.id) === Number(id));
    return estado ? estado.nombre : "No encontrado";
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
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
            metadata: { uri: "administracion/GET/ordenes" },
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
        console.log("Respuesta completa del broker (ordenes):", response.data);

        if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Órdenes extraídas (data):", response.data.response.data.data);
          setOrdenes(response.data.response.data.data);
        } else if (
          response.data?.response?.data?.ordenes &&
          Array.isArray(response.data.response.data.ordenes)
        ) {
          console.log("Órdenes extraídas (ordenes):", response.data.response.data.ordenes);
          setOrdenes(response.data.response.data.ordenes);
        } else if (
          response.data?.response?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Órdenes extraídas (array directo):", response.data.response.data);
          setOrdenes(response.data.response.data);
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
    fetchOrdenes();
  }, []);

  // Función para crear una nueva orden
  const handleCrearOrden = async (ordenData) => {
    setAlert(null);
    const token = localStorage.getItem("token");
    const payload = {
      metadata: { uri: "administracion/POST/ordenes" },
      request: ordenData,
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
      if (brokerResponse && brokerResponse.message) {
        setAlert(
          <div style={{ color: "#fff", background: "#28a745", borderRadius: 4, padding: 12, margin: 10 }}>
            <strong>{brokerResponse.message}</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
          </div>
        );
        // Opcional: recargar las órdenes
        setOrdenes(prev => [...prev, { ...ordenData, id: brokerResponse.id }]);
      } else {
        setAlert("Orden guardada, pero no se recibió mensaje de confirmación.");
      }
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
          <div style={{ color: "#fff", background: "#dc3545", borderRadius: 4, padding: 12, margin: 10 }}>
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

  // Función para editar una orden existente
  const handleEditarOrden = async (id, ordenData) => {
    setAlert(null);
    const token = localStorage.getItem("token");
    const payload = {
      metadata: { uri: `administracion/PUT/ordenes/${id}` },
      request: ordenData,
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
      if (brokerResponse && brokerResponse.message) {
        setAlert(
          <div style={{ color: "#fff", background: "#28a745", borderRadius: 4, padding: 12, margin: 10 }}>
            <strong>{brokerResponse.message}</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
          </div>
        );
        // Actualiza la orden en el estado local
        setOrdenes(prev =>
          prev.map(o => (o.id === id ? { ...o, ...ordenData } : o))
        );
      } else {
        setAlert("Orden actualizada, pero no se recibió mensaje de confirmación.");
      }
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
          <div style={{ color: "#fff", background: "#dc3545", borderRadius: 4, padding: 12, margin: 10 }}>
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

  const handleNuevaOrden = () => {
    setOrdenSeleccionada(null);
    setModalOpen(true);
  };

  const handleEditar = (orden) => {
    setOrdenSeleccionada(orden);
    setModalOpen(true);
  };

  const handleGuardar = (ordenData) => {
    if (ordenSeleccionada) {
      handleEditarOrden(ordenSeleccionada.id, ordenData);
    } else {
      handleCrearOrden(ordenData);
    }
    setModalOpen(false);
  };

  // Nueva función para obtener detalle de la orden
  const handleVerDetalles = async (orden) => {
    setDetalleModalOpen(false);
    setOrdenDetalle(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `administracion/GET/ordenes/${orden.id}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data?.response?.data?.orden;
      if (data) {
        setOrdenDetalle(data);
        setDetalleModalOpen(true);
      } else {
        setAlert("No se pudo obtener el detalle de la orden.");
      }
    } catch (err) {
      setAlert("Error al obtener el detalle de la orden.");
    }
  };

  // Función para cambiar el estado de una orden
  const handleCambiarEstado = async (ordenId, estadoId) => {
    setAlert(null);
    const token = localStorage.getItem("token");
    const payload = {
      metadata: { uri: `administracion/PATCH/ordenes/${ordenId}` },
      request: { id_estado_orden: estadoId },
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
      if (brokerResponse && brokerResponse.message) {
        setAlert(
          <div style={{ color: "#fff", background: "#28a745", borderRadius: 4, padding: 12, margin: 10 }}>
            <strong>{brokerResponse.message}</strong>
            {brokerMsg && (
              <>
                <br />
                <span>{brokerMsg}</span>
              </>
            )}
          </div>
        );
        // Actualiza el estado local de la orden
        setOrdenes(prev =>
          prev.map(o =>
            o.id === ordenId ? { ...o, id_estado_orden: estadoId } : o
          )
        );
        setCambiarEstadoId(null);
        setNuevoEstado("");
      } else {
        setAlert("Estado cambiado, pero no se recibió mensaje de confirmación.");
      }
    } catch (error) {
      setAlert("Error al cambiar el estado de la orden.");
    }
  };

  // Función para formatear la fecha de manera amigable
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      // Intenta parsear la fecha, soportando tanto "YYYY-MM-DD" como "YYYY-MM-DDTHH:mm:ss"
      const date = new Date(fechaStr);
      if (isNaN(date)) return fechaStr;
      return format(date, "dd/MM/yyyy HH:mm");
    } catch {
      return fechaStr;
    }
  };

  // Filtro combinado
  const ordenesFiltradas = ordenes.filter((orden) => {
    // Filtro por servicio
    const coincideServicio =
      !filtroServicio ||
      Number(orden.id_servicio || orden.servicio?.id) === Number(filtroServicio);

    // Filtro por proveedor
    const coincideProveedor =
      !filtroProveedor ||
      Number(orden.id_proveedor || orden.proveedor?.id) === Number(filtroProveedor);

    // Filtro de búsqueda (opcional, puedes quitarlo si no lo quieres)
    

    return coincideServicio && coincideProveedor;
  });

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{error}</pre>
      </div>
    );

  return (
    <>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0">Listado de Órdenes</h3>
                </Col>
                <Col className="d-flex justify-content-end align-items-center">
                  {/* Filtro por servicio */}
                  <Input
                    type="select"
                    value={filtroServicio}
                    onChange={e => setFiltroServicio(e.target.value)}
                    style={{ maxWidth: "200px", marginRight: "10px" }}
                  >
                    <option value="">Todos los servicios</option>
                    {catalogoServicios.map(servicio => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </Input>
                  {/* Filtro por proveedor */}
                  <Input
                    type="select"
                    value={filtroProveedor}
                    onChange={e => setFiltroProveedor(e.target.value)}
                    style={{ maxWidth: "200px", marginRight: "10px" }}
                  >
                    <option value="">Todos los proveedores</option>
                    {catalogoProveedores.map(prov => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombres} {prov.apellidos}
                      </option>
                    ))}
                  </Input>
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
                    <th>Fecha</th>
                    <th>Servicio</th>
                    <th>Proveedor</th>
                    <th>Costo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.length > 0 ? (
                    ordenesFiltradas.map((orden) => (
                      <tr key={orden.id}>
                        <td>{orden.id}</td>
                        <td>{formatFecha(orden.fecha_orden)}</td>
                        <td>{getServicioNombre(orden.id_servicio || orden.servicio?.id)}</td>
                        <td>{getProveedorNombre(orden.id_proveedor)}</td>
                        <td>${orden.costo_total}</td>
                        <td>
                          {getEstadoMovimientoNombre(orden.id_estado_orden)}
                        </td>
                        <td>
                          <Button
                            color="info"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleVerDetalles(orden)}
                          >
                            <FontAwesomeIcon icon={faEye} /> Ver
                          </Button>
                          {cambiarEstadoId === orden.id ? (
                            <>
                              <Input
                                type="select"
                                value={nuevoEstado}
                                onChange={e => setNuevoEstado(e.target.value)}
                                style={{ width: 150, display: "inline-block", marginRight: 8 }}
                                size="sm"
                              >
                                <option value="">Seleccione estado</option>
                                {catalogoEstadosMovimiento.map(est => (
                                  <option key={est.id} value={est.id}>
                                    {est.nombre}
                                  </option>
                                ))}
                              </Input>
                              <Button
                                color="success"
                                size="sm"
                                onClick={() => {
                                  if (nuevoEstado) handleCambiarEstado(orden.id, nuevoEstado);
                                }}
                                disabled={!nuevoEstado}
                              >
                                Guardar
                              </Button>
                              <Button
                                color="secondary"
                                size="sm"
                                onClick={() => {
                                  setCambiarEstadoId(null);
                                  setNuevoEstado("");
                                }}
                                style={{ marginLeft: 4 }}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => {
                                setCambiarEstadoId(orden.id);
                                setNuevoEstado("");
                              }}
                            >
                              Cambiar Estado
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No se encontraron órdenes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* Modal para crear/editar orden */}
      {modalOpen && (
        <OrdenForm
          orden={ordenSeleccionada}
          estadosDetalles={estadosDetalles}
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
          onSave={handleGuardar}
        />
      )}
      <OrdenDetalleModal
        isOpen={detalleModalOpen}
        toggle={() => setDetalleModalOpen(false)}
        orden={ordenDetalle}
      />
      {alert && (
        <div style={{ background: "#343a40", borderRadius: 4, padding: 12, margin: 10, color: "#fff" }}>
          {alert}
        </div>
      )}
    </>
  );
};

export default OrdenList;