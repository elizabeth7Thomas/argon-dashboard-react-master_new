// src/Admin/Servicios/ServicioList.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  CardHeader,
  Row,
  Col,
  Input,
  CardBody,
  Spinner,
} from "reactstrap";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function ServicioList() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
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
            metadata: { uri: "administracion/GET/servicios" },
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
        console.log("Respuesta completa del broker (servicios):", response.data);

        if (
          response.data?.response?.data?.servicios &&
          Array.isArray(response.data.response.data.servicios)
        ) {
          console.log("Servicios extraídos (servicios):", response.data.response.data.servicios);
          setServicios(response.data.response.data.servicios);
        } else if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Servicios extraídos (data):", response.data.response.data.data);
          setServicios(response.data.response.data.data);
        } else if (
          response.data?.response?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Servicios extraídos (array directo):", response.data.response.data.data);
          setServicios(response.data.response.data);
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
    fetchServicios();
  }, []);

  const serviciosFiltrados = servicios.filter(
    (s) =>
      (s.nombre && s.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (s.descripcion && s.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (s.id && s.id.toString().includes(busqueda))
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
                <h3 className="mb-0">Listado de Servicios</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar servicio..."
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
                </tr>
              </thead>
              <tbody>
                {serviciosFiltrados.length > 0 ? (
                  serviciosFiltrados.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.id}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No se encontraron servicios
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