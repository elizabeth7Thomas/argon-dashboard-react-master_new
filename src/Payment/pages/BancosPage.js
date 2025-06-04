import React, { useEffect, useState } from "react";
import axios from "axios";
import BancoList from "../Bancos/BancosList";
import BancoForm from "../Bancos/BancosForm";
import { Button } from "reactstrap";

export default function BancosPage() {
  const [bancos, setBancos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchBancos = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/bancos/obtener" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data?.response?.data?.Bancos;
      setBancos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar los bancos:", error);
      alert("Error al cargar los bancos.");
    }
  };

  useEffect(() => {
    fetchBancos();
  }, []);

  const handleView = async (banco) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/bancos/obtener/${banco._id}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const detalle = response.data?.response?.data?.Banco;
      alert(`Banco: ${detalle.nombre}\nTotal Transacciones: ${detalle.totalTransacciones}`);
    } catch (error) {
      console.error("Error al obtener el banco:", error);
      alert("Error al obtener los detalles del banco.");
    }
  };

  const handleEdit = (banco) => {
    alert("La edición no está habilitada en el backend.");
  };

  const handleDelete = async (banco) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/bancos/eliminar/${banco._id}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Banco ${banco.nombre} eliminado.`);
      setBancos(bancos.filter((b) => b._id !== banco._id));
    } catch (error) {
      console.error("Error al eliminar el banco:", error);
      alert("Error al eliminar el banco.");
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({});
    setModalOpen(true);
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Bancos</h2>
      <Button color="primary" className="mb-3" onClick={handleOpenCreate}>
        Crear Banco
      </Button>
      <BancoList bancos={bancos} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      <BancoForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSuccess={fetchBancos}
        isEditing={isEditing}
      />
    </div>
  );
}
