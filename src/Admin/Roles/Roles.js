// src/Admin/Roles/Roles.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import routes from '../routes';
import RolList from './RolList';
import RolForm from './RolForm';
import {Modal, ModalHeader, ModalBody } from 'reactstrap';
import HeaderAdministracion from 'components/Headers/HeaderAdministracion';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(routes.Administracion.Roles.GET_ALL);
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEditingData(null);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (item) => {
    setEditingData(item);
    setModalOpen(true);
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este rol?")) {
      try {
        await axios.patch(routes.Administracion.Roles.DELETE(id));
        alert("Rol eliminado con éxito");
        fetchRoles();
      } catch (error) {
        console.error("Error al eliminar rol:", error);
      }
    }
  };

  const handleSave = async (rolData) => {
    try {
      await axios.post(routes.Administracion.Roles.CREATE, rolData);
      alert("Rol registrado con éxito");
      fetchRoles();
      toggleModal();
    } catch (error) {
      console.error("Error al guardar rol:", error);
      alert("Error al guardar rol");
    }
  };

  return (
    <div>
    <HeaderAdministracion title="Roles" />
      <h2>Gestión de Roles</h2>
      <button className="btn btn-primary mb-3" onClick={toggleModal}>Agregar Rol</button>
      
      <RolList 
        roles={roles} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={toggleModal}
      />

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Agregar Rol</ModalHeader>
        <ModalBody>
          <RolForm 
          initialData={editingData} 
          onSave={handleSave} 
          onCancel={toggleModal} />
        </ModalBody>
      </Modal>
    </div>
  );
}
