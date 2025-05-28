// src/Admin/Empleados/Empleados.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes';
import EmpleadoList from './EmpleadoList';
import EmpleadoForm from './EmpleadoForm';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import HeaderAdministracion from 'components/Headers/HeaderAdministracion';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(routes.Administracion.Empleados.GET_ALL);
      setEmpleados(response.data.empleados || []);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEditingData(null); // limpiar datos al cerrar modal
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este empleado?")) {
      try {
        await axios.delete(routes.Administracion.Empleados.DELETE(id));
        fetchEmpleados();
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

 const handleSave = async (empleadoPayload) => {
  try {
    if (editingData) {
      await axios.put(routes.Administracion.Empleados.UPDATE(editingData.empleado.id), empleadoPayload);
      alert("Empleado actualizado con éxito");
    } else {
      const response = await axios.post(routes.Administracion.Empleados.CREATE, empleadoPayload);
      alert(response.data.message + "\nUsuario: " + response.data.autenticacion.usuario + "\nContraseña temporal: " + response.data.autenticacion.contraseniaTemporal);
    }
    fetchEmpleados();
    toggleModal();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      alert("Ocurrió un error al guardar el empleado");
    }
  };

  return (
    
    <div>
      <HeaderAdministracion title="Empleados" />
      <button className="btn btn-primary mb-3" onClick={toggleModal}>Agregar Empleado</button>

      <EmpleadoList 
        empleados={empleados} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onClose={toggleModal} 
      />

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{editingData ? "Editar Empleado" : "Nuevo Empleado"}</ModalHeader>
        <ModalBody>
          <EmpleadoForm 
            onSave={handleSave} 
            onCancel={toggleModal} 
            initialData={editingData} 
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
