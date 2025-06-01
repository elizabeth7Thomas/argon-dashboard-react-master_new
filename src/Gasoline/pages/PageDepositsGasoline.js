// src/gasoline/Deposits/Deposits.js
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button, Badge, Modal
} from 'reactstrap';

import Header from "components/Headers/Header_deposit";
import { faPlus, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DepositForm from '../Deposits/DepositForm';
import DepositList from '../Deposits/DepositList';

export default function Deposits() {
  const [deposits, setDeposits] = useState([
    {
      generalDepositId: '1',
      maxCapacity: 10000,
      actualQuantity: 5000,
      fuel: { fuelId: 'f1', fuelName: 'Gasolina 95' }
    },
    {
      generalDepositId: '2',
      maxCapacity: 15000,
      actualQuantity: 10000,
      fuel: { fuelId: 'f2', fuelName: 'Diesel' }
    }
  ]);

  const [modalNew, setModalNew] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const toggleNew = () => {
    setModalNew(!modalNew);
    if (!modalNew) setEditingData(null);
  };

  const handleSave = (deposit) => {
    if (editingData) {
      setDeposits(deposits.map(d => d.generalDepositId === deposit.generalDepositId ? deposit : d));
    } else {
      deposit.generalDepositId = crypto.randomUUID();
      setDeposits([...deposits, deposit]);
    }
    toggleNew();
  };

  const handleEdit = (deposit) => {
    setEditingData(deposit);
    setModalNew(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este depósito?")) {
      setDeposits(deposits.filter(d => d.generalDepositId !== id));
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5" fluid>
        {/* Encabezado */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h3>
                      <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                      Gestión de Depósitos
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

        {/* Botón Nueva Bomba */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Listado de Depósitos</h4>
                  <Button color="success" onClick={toggleNew}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nuevo Depósito
                  </Button>
                </div>
                <DepositList
                  deposits={deposits}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

{/* Modal Formulario */}
<Modal isOpen={modalNew} toggle={toggleNew}>
  <DepositForm
    onSave={handleSave}
    onCancel={toggleNew}
    initialData={editingData}
  />
</Modal>

      </Container>
    </>
  );
}
