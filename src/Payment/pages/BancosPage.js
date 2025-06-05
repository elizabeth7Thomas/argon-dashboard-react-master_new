import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import BancoList from "../Bancos/BancosList";
import BancoForm from "../Bancos/BancosForm";
import { obtenerBancos, crearBanco, eliminarBanco } from "../Bancos/bancoService";

function BancosPage() {
  const [bancos, setBancos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBancos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerBancos();
      setBancos(data);
    } catch (err) {
      setError("Error al cargar los bancos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await crearBanco(formData.nombre);
      fetchBancos();
      setModalOpen(false);
      setFormData({ nombre: "" });
    } catch (error) {
      console.error("Error al crear banco:", error);
      alert("Error al crear el banco");
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("¿Está seguro de eliminar este banco?")) return;
  
  try {
    const result = await eliminarBanco(id);
    
    if (result.success) {
      alert(result.message); 
      fetchBancos(); 
    } else {
      alert(result.message); 
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al eliminar el banco");
  }
};
  useEffect(() => {
    fetchBancos();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Bancos</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <Button color="primary" className="mb-3" onClick={() => setModalOpen(true)}>
        Nuevo Banco
      </Button>

      {loading ? (
        <div>Cargando bancos...</div>
      ) : (
        <BancoList 
          bancos={bancos} 
          onDelete={handleDelete} 
        />
      )}

      <BancoForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreate}
      />
    </div>
  );
}

export default BancosPage;