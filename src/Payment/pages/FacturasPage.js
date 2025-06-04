import React, { useState } from "react";
import { Button, Container } from "reactstrap";
import FacturasList from "../Facturas/FacturaList";
import FacturaForm from "../Facturas/FacturaForm";

function FacturasPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Facturas</h2>
        
      </div>

      <FacturasList />

      <FacturaForm isOpen={modalOpen} toggle={toggleModal} />
    </Container>
  );
}

export default FacturasPage;
