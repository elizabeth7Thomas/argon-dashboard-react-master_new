// src/CierreCaja/CierreCajaPage.js
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import CierreCajaList from '../CierreCaja/CierreCajaList';
import CierreCajaDetail from '../CierreCaja/CierreCajaDetail';
import CierreCajaForm from '../CierreCaja/CierreCajaForm';

const CierreCajaPage = () => {
  const [selectedCierre, setSelectedCierre] = useState(null);
  const [reload, setReload] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (cierre) => {
    setSelectedCierre(cierre);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleReload = () => {
    setReload(!reload);
  };

  return (
    <div className="container mt-4">
      <h2>Cierre de Caja</h2>
      <Button color="success" onClick={toggleModal}>
        Nuevo Cierre
      </Button>
      <CierreCajaList onSelect={handleSelect} reload={reload} />
      {selectedCierre && <CierreCajaDetail cierre={selectedCierre} />}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Nuevo Cierre de Caja</ModalHeader>
        <ModalBody>
          <CierreCajaForm onSuccess={() => { toggleModal(); handleReload(); }} />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CierreCajaPage;
