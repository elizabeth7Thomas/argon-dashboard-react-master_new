// src/gasoline/Alerts/Alerts.js
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button, Badge, Table
} from 'reactstrap';
import { faExclamationTriangle, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertForm from './AlertForm';
import Header from "components/Headers/Header_alerta";

export default function Alerts() {
  const [modalForm, setModalForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ tipo: '', mensaje: '', nivel: 'informativa', id: Date.now() });
  const [alerts, setAlerts] = useState([
    { id: 1, tipo: 'Combustible Bajo', mensaje: 'El tanque 1 está por debajo del 10%', nivel: 'critica' },
    { id: 2, tipo: 'Mantenimiento', mensaje: 'La bomba 2 necesita revisión', nivel: 'advertencia' },
    { id: 3, tipo: 'Actualización', mensaje: 'Se realizó una carga exitosa de combustible', nivel: 'informativa' },
  ]);

  const toggleForm = () => {
    setModalForm(!modalForm);
    if (!modalForm) {
      setFormData({ tipo: '', mensaje: '', nivel: 'informativa', id: Date.now() });
      setIsEditing(false);
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      setAlerts(prev => prev.map(alert => alert.id === formData.id ? formData : alert));
    } else {
      setAlerts(prev => [...prev, formData]);
    }
    toggleForm();
  };

  const handleEdit = (alerta) => {
    setFormData(alerta);
    setIsEditing(true);
    setModalForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta alerta?")) {
      setAlerts(prev => prev.filter(item => item.id !== id));
    }
  };

  const getBadgeColor = (nivel) => {
    switch(nivel) {
      case 'critica': return 'danger';
      case 'advertencia': return 'warning';
      default: return 'info';
    }
  };

  return (
    <>
      <Header />
      <div className="flex-grow-1">
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
                      <Badge color="primary" pill>Beta</Badge>
                    </Col>
                  </Row>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Button color="success" onClick={toggleForm} className="btn-icon float-right">
                <span className="btn-inner--icon"><FontAwesomeIcon icon={faPlus} /></span>
                <span className="btn-inner--text">Nueva Alerta</span>
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="shadow">
                <CardHeader>
                  <h5 className="mb-0">Listado de Alertas</h5>
                </CardHeader>
                <CardBody>
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
                        <tr key={alerta.id}>
                          <td>{alerta.tipo}</td>
                          <td>{alerta.mensaje}</td>
                          <td>
                            <Badge color={getBadgeColor(alerta.nivel)}>
                              {alerta.nivel}
                            </Badge>
                          </td>
                          <td>
                            <Button color="warning" size="sm" onClick={() => handleEdit(alerta)} className="mr-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button color="danger" size="sm" onClick={() => handleDelete(alerta.id)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg="4">
              <Card className="bg-gradient-danger border-0 shadow">
                <CardBody className="py-3">
                  <div className="text-white">
                    <h5 className="text-uppercase ls-1 mb-1">Críticas</h5>
                    <h2 className="mb-0">{alerts.filter(a => a.nivel === 'critica').length}</h2>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="bg-gradient-warning border-0 shadow">
                <CardBody className="py-3">
                  <div className="text-white">
                    <h5 className="text-uppercase ls-1 mb-1">Advertencias</h5>
                    <h2 className="mb-0">{alerts.filter(a => a.nivel === 'advertencia').length}</h2>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="bg-gradient-info border-0 shadow">
                <CardBody className="py-3">
                  <div className="text-white">
                    <h5 className="text-uppercase ls-1 mb-1">Informativas</h5>
                    <h2 className="mb-0">{alerts.filter(a => a.nivel === 'informativa').length}</h2>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

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
