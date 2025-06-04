import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Spinner,
  Badge,
  Alert,
} from "reactstrap";
import {
  faGasPump,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apiClient from "../utils/apiClient";
import DepositForm from "../Deposits/DepositForm";

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
    setLoading(true);
    try {
      const response = await apiClient.post("", {
        metadata: { uri: "generalDeposit/list" },
        request: {},
      });

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
    try {
      const requestData = {
        maxCapacity: formData.maxCapacity
          ? parseFloat(formData.maxCapacity)
          : 0,
        currentCapacity: formData.currentCapacity
          ? parseFloat(formData.currentCapacity)
          : 0,
        fuel: {
          fuelId: formData.fuel?.fuelId,
          fuelName: formData.fuel?.fuelName,
          salePriceGalon: formData.fuel?.salePriceGalon
            ? parseFloat(formData.fuel.salePriceGalon)
            : 0,
        },
      };

      if (isEditing) {
        await apiClient.post("", {
          metadata: {
            uri: `generalDeposit/update/${formData.generalDepositId}`,
          },
          request: requestData,
        });
      } else {
        await apiClient.post("", {
          metadata: { uri: "generalDeposit/create" },
          request: requestData,
        });
      }

      fetchDeposits();
      toggleForm();
    } catch (err) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "crear"} depósito:`,
        err
      );
    }
  };

  const handleEdit = (deposit) => {
    setFormData(deposit);
    setIsEditing(true);
    setModalForm(true);
  };

  const handleDelete = async (generalDepositId) => {
    if (!window.confirm("¿Estás seguro de eliminar este depósito?")) return;

    try {
      await apiClient.post("", {
        metadata: {
          uri: `generalDeposit/delete/${generalDepositId}`,
        },
        request: {},
      });

      fetchDeposits();
    } catch (err) {
      console.error("Error al eliminar depósito:", err);
    }
  };

  return (
    <>
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
                          <td>{dep.fuel?.fuelName || "Desconocido"}</td>
                          <td>{Number(dep.maxCapacity).toFixed(4)} gal</td>
                          <td>{Number(dep.currentCapacity).toFixed(4)} gal</td>
                          <td>{dep.createdBy?.employeeName || "N/A"}</td>
                          <td>
                            <Badge color={dep.status ? "success" : "secondary"}>
                              {dep.status ? "Activo" : "Inactivo"}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              color="info"
                              size="sm"
                              onClick={() => handleEdit(dep)}
                              className="mr-2"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(dep.generalDepositId)}
                            >
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
