// src/gasoline/pages/PageAlerts.Gasoline.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button, Badge, Table, Spinner
} from 'reactstrap';
import { faExclamationTriangle, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import AlertForm from '../Alerts/AlertForm'; // Asumimos que este componente modal ya existe
import Header from "components/Headers/Header_alerta";

export default function Alerts() {
  const [modalForm, setModalForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ tipo: '', mensaje: '', nivel: 'informativa', id: Date.now() });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleForm = () => {
    setModalForm(!modalForm);
    if (!modalForm) {
      setFormData({ tipo: '', mensaje: '', nivel: 'informativa', id: Date.now() });
      setIsEditing(false);
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      setAlerts(prev => prev.map(alert => alert.alertId === formData.alertId ? formData : alert));
    } else {
      setAlerts(prev => [...prev, { ...formData, alertId: `temp-${Date.now()}` }]);
    }
    toggleForm();
  };

  const handleEdit = (alerta) => {
    setFormData({
      ...alerta,
      tipo: alerta.tipo,
      mensaje: alerta.mensaje,
      nivel: alerta.nivel
    });
    setIsEditing(true);
    setModalForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta alerta?")) {
      setAlerts(prev => prev.filter(item => item.alertId !== id));
    }
  };

  const getBadgeColor = (nivel) => {
    switch (nivel) {
      case 'critica': return 'danger';
      case 'advertencia': return 'warning';
      default: return 'info';
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
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
            metadata: { uri: "alert/list" },
            request: {}
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const alertsData = response.data?.response?.data;

        if (Array.isArray(alertsData)) {
          const parsed = alertsData.map(alert => ({
            alertId: alert.alertId,
            tipo: alert.destination,
            mensaje: alert.message,
            nivel: alert.status === 1 ? 'informativa' : 'advertencia', // Puedes ajustar lógica según backend
            creadoPor: alert.createdBy?.employeeName || 'Desconocido',
            creadoEl: alert.createdAt
          }));
          setAlerts(parsed);
        } else {
          setError("La respuesta del broker no contiene una lista válida de alertas");
        }
      } catch (err) {
        console.error("Error al obtener alertas:", err);
        setError("Error al conectar con el broker");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <>
      <Header />
      <Container className="py-4" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                      Gestión de Alertas
                    </h3>
                  </Col>
                  <Col className="text-right">
                    <Badge color="primary" pill>Live</Badge>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">

        </Row>

        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader>
                <h5 className="mb-0">Listado de Alertas</h5>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <Spinner color="primary" />
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Mensaje</th>
                        <th>Nivel</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((alerta) => (
                        <tr key={alerta.alertId}>
                          <td>{alerta.tipo}</td>
                          <td>{alerta.mensaje}</td>
                          <td>
                            <Badge color={getBadgeColor(alerta.nivel)}>
                              {alerta.nivel}
                            </Badge>
                          </td>
                          <td>
                            <Button color="info" size="sm" onClick={() => handleEdit(alerta)} className="mr-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button color="danger" size="sm" onClick={() => handleDelete(alerta.alertId)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <AlertForm
        isOpen={modalForm}
        toggle={toggleForm}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </>
  );
}
