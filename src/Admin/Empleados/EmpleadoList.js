import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Input, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faIdCard, faPhone, faEnvelope, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
export default function EmpleadoList({
  onEdit,
  onDelete,
  jornadas = [],
  areas = [],
  roles = []
}) {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Imprime toda la respuesta para depuración
        console.log("Respuesta completa del broker:", response.data);

        // Imprime el posible array de empleados para ver la estructura real
        if (
          response.data?.response?.data &&
          Array.isArray(response.data.response.data.empleados)
        ) {
          console.log("Empleados extraídos:", response.data.response.data.empleados);
          setEmpleados(response.data.response.data.empleados);
        } else {
          // Imprime el contenido de data para ver qué trae realmente
          console.log("Contenido de response.data.response.data:", response.data?.response?.data);
          setError("La respuesta del broker no tiene datos válidos");
        }
      } catch (err) {
        console.error("Error al obtener empleados:", err);
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
            // Opcional: redirige al login
            // window.location.href = "/auth/login";
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

  const getJornadaNombre = (id) => {
    const jornada = jornadas.find(j => j.id === id);
    return jornada ? jornada.nombre : id;
  };

  const getAreaNombre = (id) => {
    const area = areas.find(a => a.id === id);
    return area ? area.nombre : id;
  };

  const getRolNombre = (id) => {
    const rol = roles.find(r => r.id === id);
    return rol ? rol.nombre : id;
  };

  const empleadosFiltrados = empleados.filter((item) =>
    (item.empleado.nombres + "" + item.empleado.apellidos).toLowerCase().includes((busqueda || "").toLowerCase()) ||
    (item.empleado.usuario || "" ).toLowerCase().includes((busqueda || "").toLowerCase()) ||
    (item.empleado.id ? item.empleado.id.toString() : "").includes(busqueda || "")
  );

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
                  style={{ maxWidth: "300px", marginRight: "10px" }}
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.length > 0 ? (
                  empleadosFiltrados.map((item, index) => (
                    <tr key={item.empleado.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.empleado.nombres} {item.empleado.apellidos}</td>
                      <td>{item.empleado.dpi}</td>
                      <td>{item.empleado.nit}</td>
                      <td>{item.empleado.telefono}</td>
                      <td>{item.empleado.email}</td>
                      <td>{item.empleado.usuario}</td>
                      <td>{getJornadaNombre(item.empleado.id_jornada)}</td>
                      <td>
                        {item.asignacion
                          ? (getAreaNombre(item.asignacion.id_area) || item.asignacion.area)
                          : <span className="text-muted">Sin asignación</span>
                        }
                      </td>
                      <td>
                        {item.asignacion
                          ? (getRolNombre(item.asignacion.id_rol) || item.asignacion.rol)
                          : <span className="text-muted">Sin asignación</span>
                        }
                      </td>

                      <td>
                        <Button size="sm" color="info" onClick={() => onEdit(item)} className="mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button size="sm" color="danger" onClick={() => onDelete(item.empleado.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
