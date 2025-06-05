import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Input, Row, Col } from "reactstrap";
import axios from "axios";

export default function AsistenciaLis() {
  // Obtener empleados desde la API
  const [empleados, setEmpleados] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [mensaje, setMensaje] = useState({});
  const [asistencias, setAsistencias] = useState({});
  const [inasistencias, setInasistencias] = useState({});
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");

  // Cargar empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = {
          metadata: { uri: "administracion/GET/empleados" },
          request: {}
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
        setEmpleados(response.data?.response?.data?.empleados || []);
      } catch (error) {
        setEmpleados([]);
      }
    };
    fetchEmpleados();
  }, []);

  // Función para obtener la fecha actual en formato requerido
  const getFecha = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // Buscar el empleado seleccionado
  const empleadoSeleccionado = empleados.find(e => String(e.id || e.empleado?.id) === String(empleadoId));

  // Consultar asistencias con rango personalizado
  const verAsistencias = async () => {
    if (!empleadoSeleccionado) return;
    const id = empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id;
    setLoadingId(id);
    setMensaje({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        metadata: { uri: `administracion/GET/asistencias/empleado/${id}` },
        request: {
          fecha_inicio: fechaInicio || getFecha(),
          fecha_fin: fechaFin || getFecha(),
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
      setAsistencias({
        [id]: response.data?.response?.data?.asistencias || [],
      });
    } catch (err) {
      setMensaje({
        [id]: "Error al consultar asistencias"
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Consultar inasistencias con rango personalizado
  const verInasistencias = async () => {
    if (!empleadoSeleccionado) return;
    const id = empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id;
    setLoadingId(id);
    setMensaje({});
    try {
      const token = localStorage.getItem("token");
      const payload = {
        metadata: { uri: `administracion/GET/inasistencias/empleado/${id}` },
        request: {
          fecha_inicio: fechaInicio || getFecha(),
          fecha_fin: fechaFin || getFecha(),
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
      setInasistencias({
        [id]: response.data?.response?.data?.inasistencias || [],
      });
    } catch (err) {
      setMensaje({
        [id]: "Error al consultar inasistencias"
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Row className="mb-2">
        <Col md={3}>
          <Input
            type="select"
            value={empleadoId}
            onChange={e => setEmpleadoId(e.target.value)}
          >
            <option value="">Seleccione empleado</option>
            {empleados.map(emp => (
              <option key={emp.id || emp.empleado?.id} value={emp.id || emp.empleado?.id}>
                {(emp.nombres || emp.empleado?.nombres || "")} {(emp.apellidos || emp.empleado?.apellidos || "")} - {(emp.usuario || emp.empleado?.usuario || "")}
              </option>
            ))}
          </Input>
        </Col>
        <Col md={3}>
          <Input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            placeholder="Fecha inicio"
          />
        </Col>
        <Col md={3}>
          <Input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            placeholder="Fecha fin"
          />
        </Col>
        <Col md={3}>
          <Button color="primary" onClick={verAsistencias} disabled={!empleadoId}>
            Listar Asistencias
          </Button>
          <Button color="secondary" onClick={verInasistencias} disabled={!empleadoId} style={{marginLeft: 8}}>
            Listar Inasistencias
          </Button>
        </Col>
      </Row>
      {empleadoSeleccionado && (
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Asistencias</th>
              <th>Inasistencias</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {(empleadoSeleccionado.nombres || empleadoSeleccionado.empleado?.nombres || "")} {(empleadoSeleccionado.apellidos || empleadoSeleccionado.empleado?.apellidos || "")}
              </td>
              <td>
                {asistencias[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id] && (
                  <ul style={{ fontSize: "0.85em", marginTop: 5 }}>
                    {asistencias[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id].length === 0 && <li>No hay asistencias</li>}
                    {asistencias[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id].map((a, i) => (
                      <li key={i}>
                        {a.fecha}: {a.hora_entrada} - {a.hora_salida}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td>
                {inasistencias[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id] && (
                  <ul style={{ fontSize: "0.85em", marginTop: 5 }}>
                    {inasistencias[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id].length === 0 && <li>No hay inasistencias</li>}
                    {inasistencias[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id].map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
              </td>
              <td>
                {mensaje[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id] && (
                  <span style={{ fontSize: "0.85em" }}>{mensaje[empleadoSeleccionado.id || empleadoSeleccionado.empleado?.id]}</span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </>
  );
}