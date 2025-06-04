
//src/Payment/BancosPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import BancoList from "../Bancos/BancosList";

export default function BancosPage() {
  const [bancos, setBancos] = useState([]);

  useEffect(() => {
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

    fetchBancos();
  }, []);

  const handleView = (banco) => {
    alert(`Viendo banco: ${banco.nombre}`);
  };

  const handleEdit = (banco) => {
    alert(`Editando banco: ${banco.nombre}`);
  };

  const handleDelete = async (banco) => {
    try {
      // Aquí deberías integrar la lógica real de eliminación si existe en backend
      alert(`Banco ${banco.nombre} eliminado`);
      setBancos(bancos.filter((b) => b._id !== banco._id));
    } catch (error) {
      console.error("Error al eliminar el banco:", error);
      alert("Hubo un error al eliminar el banco");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Bancos</h2>
      <BancoList bancos={bancos} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
