// src/gasoline/pages/PageDepositsGasoline.js
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button, Table, Spinner, Badge
} from 'reactstrap';
import { faGasPump, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import DepositForm from '../Deposits/DepositForm';
import Header from "components/Headers/Header_fuel";

export default function Deposits() {
  const [modalForm, setModalForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleForm = () => {
    setModalForm(!modalForm);
    if (!modalForm) {
      setFormData({});
      setIsEditing(false);
    }
  };

  const fetchDeposits = async () => {
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
          metadata: { uri: "generalDeposit/list" },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const depositsData = response.data?.response?.data || [];
      setDeposits(depositsData);
    } catch (err) {
      console.error("Error al obtener depósitos:", err);
      setError("Error al conectar con el broker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "generalDeposit/create" },
          request: {
            maxCapacity: formData.maxCapacity,
            currentCapacity: formData.currentCapacity,
            fuel: {
              fuelId: formData.fuel?.fuelId,
              fuelName: formData.fuel?.fuelName
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      fetchDeposits();
      toggleForm();
    } catch (err) {
      console.error("Error al crear depósito:", err);
    }
  };

  const handleEdit = (deposit) => {
    setFormData(deposit);
    setIsEditing(true);
    setModalForm(true);
  };

  const handleDelete = async (generalDepositId) => {
    if (!window.confirm("¿Estás seguro de eliminar este depósito?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: {
            uri: `generalDeposit/delete/${generalDepositId}`
          },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      fetchDeposits();
    } catch (err) {
      console.error("Error al eliminar depósito:", err);
    }
  };

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
                      <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                      Gestión de Depósitos de Combustible
                    </h3>
                  </Col>
                  <Col className="text-right">
                    <Button color="success" onClick={toggleForm}>
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Nuevo Depósito
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <Spinner color="primary" />
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <Table responsive bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Combustible</th>
                        <th>Capacidad Máxima</th>
                        <th>Cantidad Actual</th>
                        <th>Creado Por</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((dep, idx) => (
                        <tr key={dep.generalDepositId}>
                          <td>{idx + 1}</td>
                          <td>{dep.fuel?.fuelName || 'Desconocido'}</td>
                          <td>{dep.maxCapacity} gal</td>
                          <td>{dep.currentCapacity} gal</td>
                          <td>{dep.createdBy?.employeeName || 'N/D'}</td>
                          <td>
                            <Badge color={dep.status ? 'success' : 'secondary'}>
                              {dep.status ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td>
                            <Button color="info" size="sm" onClick={() => handleEdit(dep)} className="mr-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button color="danger" size="sm" onClick={() => handleDelete(dep.generalDepositId)}>
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
      <DepositForm
        isOpen={modalForm}
        initialData={formData}
        onSave={handleSubmit}
        onCancel={toggleForm}
      />
    </>
  );
}
