// src/gasoline/GasolineTypes/GasolineTypes.js
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button, Badge
} from 'reactstrap';
import HeaderGasolineType from 'components/Headers/Header_fuel';
import { faGasPump, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GasolineTypeForm from '../GasolineTypes/GasolineTypeForm';
import GasolineTypeList from '../GasolineTypes/GasolineTypeList';

export default function GasolineTypes() {
  const [modalForm, setModalForm] = useState(false);
  const [editingFuel, setEditingFuel] = useState(null);
  const [fuels, setFuels] = useState([
    { fuelId: 1, fuelName: 'Gasolina Regular', status: true },
    { fuelId: 2, fuelName: 'Gasolina Premium', status: true },
    { fuelId: 3, fuelName: 'Diésel', status: false }
  ]);

  const toggleForm = () => {
    setModalForm(!modalForm);
    if (!modalForm) setEditingFuel(null); // Reset al abrir el modal
  };

  const handleAddFuel = (newFuel) => {
    if (newFuel.fuelId) {
      setFuels(fuels.map(f => f.fuelId === newFuel.fuelId ? newFuel : f));
    } else {
      setFuels([...fuels, { ...newFuel, fuelId: Date.now() }]);
    }
    setModalForm(false);
  };

  const handleEdit = (fuel) => {
    setEditingFuel(fuel);
    setModalForm(true);
  };

  const handleDelete = (fuelId) => {
    if (window.confirm("¿Estás seguro de eliminar este tipo de combustible?")) {
      setFuels(fuels.filter(f => f.fuelId !== fuelId));
    }
  };

  const activeFuelsCount = fuels.filter(f => f.status).length;

  return (
    <>
      <HeaderGasolineType />
      <Container className="mt-5" fluid>
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
                    <Badge color="primary" pill>
                      {activeFuelsCount} activos
                    </Badge>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        {/* Panel de acciones */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardBody className="text-center">
                <h4 className="mb-4">Gestión de Tipos de Combustible</h4>
                <p className="text-muted mb-4">
                  Administre los diferentes tipos de combustible disponibles en el sistema
                </p>

                <div className="d-flex justify-content-center gap-4">
                  <Button color="success" onClick={toggleForm} className="btn-icon">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nuevo Tipo
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Estadísticas rápidas */}
        <Row className="mt-4">
          <Col md="4">
            <Card className="bg-gradient-info border-0 shadow">
              <CardBody className="py-3 text-white">
                <h5 className="text-uppercase ls-1 mb-1">Total Tipos</h5>
                <h2 className="mb-0">{fuels.length}</h2>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="bg-gradient-success border-0 shadow">
              <CardBody className="py-3 text-white">
                <h5 className="text-uppercase ls-1 mb-1">Activos</h5>
                <h2 className="mb-0">{activeFuelsCount}</h2>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="bg-gradient-secondary border-0 shadow">
              <CardBody className="py-3 text-white">
                <h5 className="text-uppercase ls-1 mb-1">Inactivos</h5>
                <h2 className="mb-0">{fuels.length - activeFuelsCount}</h2>
              </CardBody>
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
