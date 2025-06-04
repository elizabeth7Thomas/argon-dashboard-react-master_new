import React, { useEffect, useState } from 'react';
import {
  Table, Button, Row, Col, Input,
  Card, CardHeader, CardBody, Spinner,
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faIdCard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function RolList({ onEdit, onDelete }) {
  const [roles, setRoles] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  // Cargar catálogo de roles desde localStorage
  const catalogoRoles = JSON.parse(localStorage.getItem("catalogo_roles") || "[]");

  // Helper para mostrar el nombre del rol superior
  const getNombreRolSuperior = (id) => {
    if (!id) return "Sin superior";
    const rol = catalogoRoles.find(r => r.id === id || r.id === Number(id));
    return rol ? rol.nombre : "Sin superior";
  };

  useEffect(() => {
    const fetchRoles = async () => {
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
            metadata: { uri: "administracion/GET/roles" },
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
          response.data?.response?.data?.roles &&
          Array.isArray(response.data.response.data.roles)
        ) {
          setRoles(response.data.response.data.roles);
        } else if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          setRoles(response.data.response.data.data);
        } else if (
          response.data?.response?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          setRoles(response.data.response.data);
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
    fetchRoles();
  }, []);

  // Eliminar rol con manejo de mensajes del broker
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;
    setAlert(null);
    const token = localStorage.getItem("token");
    const uri = `administracion/PATCH/roles/${id}`;
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
      setRoles(prev => prev.filter(r => r.id !== id));
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

  const rolesFiltrados = roles.filter(
    (r) =>
      (r.nombre && r.nombre.toLowerCase().includes((busqueda || "").toLowerCase())) ||
      (r.descripcion && r.descripcion.toLowerCase().includes((busqueda || "").toLowerCase())) ||
      (r.id && r.id.toString().includes(busqueda || ""))
  );

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
                <h3 className="mb-0">Listado de Roles</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar rol..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  style={{ maxWidth: "300px", marginRight: "10px" }}
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
            <Table className="align-items-center table-flush" bordered responsive hover>
              <thead className="thead-light">
                <tr>
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> #</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Salario</th>
                  <th>Superior</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rolesFiltrados.length > 0 ? (
                  rolesFiltrados.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.salario}</td>
                      <td>{getNombreRolSuperior(item.id_rol_superior)}</td>
                      <td>
                        <Button size="sm" color="info" onClick={() => onEdit(item)} className="mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button size="sm" color="danger" onClick={() => handleDelete(item.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No se encontraron roles
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