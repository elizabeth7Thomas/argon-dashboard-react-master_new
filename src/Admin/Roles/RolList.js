// src/Admin/Roles/RolList.js

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Card,
  CardHeader,
  CardBody,
  Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faIdCard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function RolList({ onEdit, onDelete }) {
  const [roles, setRoles] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Respuesta completa del broker (Roles):", response.data);

        if (
          response.data?.response?.data?.roles &&
          Array.isArray(response.data.response.data.roles)
        ) {
          console.log("Roles extraídos (roles):", response.data.response.data.roles);
          setRoles(response.data.response.data.roles);
        } else if (
          response.data?.response?.data?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Roles extraídos (data):", response.data.response.data.data);
          setRoles(response.data.response.data.data);
        } else if (
          response.data?.response?.data &&
          Array.isArray(response.data.response.data.data)
        ) {
          console.log("Roles extraídos (array directo):", response.data.response.data.data);
          setRoles(response.data.response.data);
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
    fetchRoles();
  }, []);

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
            <Table className="align-items-center table-flush" bordered responsive hover>
              <thead className="thead-light">
                <tr>
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /> #</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Salario</th>
                  <th>ID Rol Superior</th>
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
                      <td>{item.id_rol_superior}</td>
                      <td>
                        <Button size="sm" color="warning" onClick={() => onEdit(item)} className="mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button size="sm" color="danger" onClick={() => onDelete(item.id)}>
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