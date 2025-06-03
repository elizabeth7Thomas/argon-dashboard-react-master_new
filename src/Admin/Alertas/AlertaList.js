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
} from "reactstrap";
import { faEdit, faTrashAlt, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function AlertaList({ onEditar, onEliminar }) {
  const [alertas, setAlertas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const alertasFiltradas = alertas.filter(
    (a) =>
      (a.nombre_producto && a.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.mensaje && a.mensaje.toLowerCase().includes(busqueda.toLowerCase())) ||
      (a.id && a.id.toString().includes(busqueda))
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
                <h3 className="mb-0">Listado de Alertas</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar alerta..."
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
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> ID</th>
                  <th>Producto</th>
                  <th>Mensaje</th>
                  <th>ID Servicio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alertasFiltradas.length > 0 ? (
                  alertasFiltradas.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.id}</td>
                      <td>{item.nombre_producto}</td>
                      <td>{item.mensaje}</td>
                      <td>{item.id_servicio}</td>
                      <td>
                        {item.estado === true
                          ? <span className="text-success font-weight-bold">Activo</span>
                          : <span className="text-danger font-weight-bold">Desactivo</span>
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}