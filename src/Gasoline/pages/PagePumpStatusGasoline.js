import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import PumpStatusList from '../PumpStatus/PumpStatusList';
import PumpStatusForm from '../PumpStatus/PumpStatusForm';

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
      
      <Container className="mt-5" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardBody>
                
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
