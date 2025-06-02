import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Input,
  Spinner,
} from "reactstrap";
import {
  faEdit,
  faTrashAlt,
  faIdCard,
  faClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const DIAS = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export default function JornadaList({
  onEditar = () => {},
  onEliminar = () => {},
}) {
  const [jornadas, setJornadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJornadas = async () => {
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
            metadata: { uri: "administracion/GET/jornadas" },
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
        console.log("Respuesta completa del broker:", response.data);

        // Ajuste para la estructura esperada
        if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Jornadas extraídas:", response.data.response.data.data);
          setJornadas(response.data.response.data.data);
        } else {
          console.log("Contenido de response.data.response.data:", response.data?.response?.data);
          setError("La respuesta del broker no tiene datos válidos");
        }
      } catch (err) {
        console.error("Error al obtener jornadas:", err);
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
    fetchJornadas();
  }, []);

  const jornadasFiltradas = jornadas.filter(
    (j) =>
      (j.nombre && j.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (j.descripcion && j.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (j.id && j.id.toString().includes(busqueda))
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );
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
          <CardBody>
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
                      <td>
                        {Array.isArray(item.dias_laborales)
                          ? item.dias_laborales.map((d) => DIAS[d] || d).join(", ")
                          : ""}
                      </td>
                      <td>{item.hora_inicio}</td>
                      <td>{item.hora_fin}</td>
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}