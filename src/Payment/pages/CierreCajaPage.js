import React, { useState } from 'react';
import { Button, Modal } from 'reactstrap';
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
    if (!modalOpen) {
      setSelectedCierre(null); // Limpiar selección al abrir nuevo formulario
    }
  };

  const handleSuccess = () => {
    setReload(prev => !prev); // Forzar recarga de la lista
    toggleModal(); // Cerrar el modal
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Cierre de Caja</h2>
        <Button color="success" onClick={toggleModal}>
          Nuevo Cierre
        </Button>
      </div>

      <CierreCajaList 
        onSelect={handleSelect} 
        reload={reload} 
      />

      {selectedCierre && (
        <div className="mt-4">
          <CierreCajaDetail cierre={selectedCierre} />
        </div>
      )}

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <CierreCajaForm 
          isOpen={modalOpen}
          toggle={toggleModal}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default CierreCajaPage;