import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import HeaderPumpStatus from 'components/Headers/HeaderPumpStatus';
import PumpStatusList from './PumpStatusList';
import PumpStatusForm from './PumpStatusForm';

export default function PumpStatus() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPump, setSelectedPump] = useState(null);

  const handleEdit = (pump) => {
    setSelectedPump(pump);
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedPump(null);
    setModalOpen(true);
  };

  return (
    <>
      <HeaderPumpStatus />
      <Container className="mt-5" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0">Listado de Bombas</h3>
                  <Button color="primary" onClick={handleNew}>
                    Nueva Bomba
                  </Button>
                </div>
                <PumpStatusList onEdit={handleEdit} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <PumpStatusForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        initialData={selectedPump}
      />
    </>
  );
}
