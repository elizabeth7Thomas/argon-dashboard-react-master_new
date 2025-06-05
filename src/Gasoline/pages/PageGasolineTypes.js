import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
} from "reactstrap";
import { faGasPump, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GasolineTypeForm from "../GasolineTypes/GasolineTypeForm";
import GasolineTypeList from "../GasolineTypes/GasolineTypeList";
import apiClient from "Gasoline/utils/apiClient";


export default function GasolineTypes() {
  const [loading, setLoading] = useState(true)
  const [modalForm, setModalForm] = useState(false);
  const [editingFuel, setEditingFuel] = useState(null);
  const [fuels, setFuels] = useState([]);

  const fetchFuels = async () => {
    try {
      const response = await apiClient.post("", {
        metadata: { uri: "fuelType/list" },
        request: {},
      });
      if (response?.data?.response?.data) {
        setFuels(response.data.response.data);
      }
    } catch (err) {
      console.error("Error al cargar los tipos de combustible:", err);
    }
  };

  useEffect(() => {
    fetchFuels();
  }, []);

  const toggleForm = () => {
    setModalForm(!modalForm);
    if (!modalForm) setEditingFuel(null); // Reset al abrir el modal
  };

  const handleAddFuel = async (newFuel) => {
    try {
      const requestData = {
        fuelName: newFuel.fuelName,
        costPriceGalon: newFuel.costPriceGalon
          ? parseFloat(newFuel.costPriceGalon)
          : 0,
        salePriceGalon: newFuel.salePriceGalon
          ? parseFloat(newFuel.salePriceGalon)
          : 0,
        createdBy: { employeeId: "N/A", employeeName: "N/A" },
      };

      if (editingFuel) {
        await apiClient.post("", {
          metadata: {
            uri: `fuelType/update/${newFuel.fuelId}`,
          },
          request: requestData,
        });
      } else {
        await apiClient.post("", {
          metadata: { uri: "fuelType/create" },
          request: requestData,
        });
      }

      setModalForm(false);
      await fetchFuels();
    } catch (err) {
      console.error(
        `Error al ${editingFuel ? "actualizar" : "crear"} tipo de combustible:`,
        err
      );
    }
  };

  const handleEdit = (fuel) => {
    setEditingFuel(fuel);
    setModalForm(true);
  };

  const handleDelete = async (fuelId) => {
  if (!window.confirm("¿Estás seguro de eliminar este tipo de combustible?")) return;

  setLoading(true);
  try {
    await apiClient.post("", {
      metadata: { uri: `fuelType/delete/${fuelId}` },
      request: {},
    });
    await fetchFuels(); 
  } catch (err) {
    console.error("Error al eliminar:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Container className="mt-3" fluid>
        {/* Encabezado */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">
                      <FontAwesomeIcon icon={faGasPump} className="mr-2" />
                      Tipos de Combustible
                    </h3>
                  </Col>
                  <Col className="text-right">
                    <Button
                      color="success"
                      onClick={toggleForm}
                      className="btn-icon"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Nuevo Tipo
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        {/* Listado directo (sin modal) */}
        <Row className="mt-4">
          <Col>
            <GasolineTypeList fuels={fuels} onEdit={handleEdit} onDelete={handleDelete} />
          </Col>
        </Row>

        {/* Modal Formulario */}
        <GasolineTypeForm
          isOpen={modalForm}
          toggle={toggleForm}
          onSubmit={handleAddFuel}
          fuel={editingFuel}
        />
      </Container>
    </>
  );
}
