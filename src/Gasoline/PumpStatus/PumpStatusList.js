import React, { useState, useEffect } from "react";
import { 
  Table, Button, Spinner, ButtonGroup, Badge, Alert 
} from "reactstrap";
import { fetchPumps, deletePump } from "./PumpService";
import PumpStatusForm from "./PumpStatusForm";

export default function PumpStatusList() {
  const [bombs, setBombs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPump, setSelectedPump] = useState(null);

  const loadPumps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPumps(filter);
      setBombs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPumps();
  }, [filter]);

  const handleEdit = (pump) => {
    setSelectedPump(pump);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPump(null);
    setModalOpen(true);
  };

  const handleDelete = async (bombId) => {
    if (!window.confirm("¿Está seguro de eliminar esta bomba?")) return;
    
    setLoading(true);
    try {
      await deletePump(bombId);
    setTimeout(() => {
        setSuccess(null);
      }, 3000);      loadPumps();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1: return <Badge color="dark">Bloqueado</Badge>;
      case 2: return <Badge color="info">Liberada</Badge>;
      case 3: return <Badge color="success">Activo</Badge>;
      case 4: return <Badge color="warning">Mantenimiento</Badge>;
      default: return <Badge color="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div>
      <h2>Administración de Bombas</h2>
      
      {error && <Alert color="danger">{error.toString()}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <div className="mb-3 d-flex justify-content-between">
        <ButtonGroup>
          <Button color={filter === "all" ? "primary" : "secondary"} onClick={() => setFilter("all")}>
            Todas
          </Button>
          <Button color={filter === "active" ? "primary" : "secondary"} onClick={() => setFilter("active")}>
            Activas
          </Button>
          <Button color={filter === "inactive" ? "primary" : "secondary"} onClick={() => setFilter("inactive")}>
            Inactivas
          </Button>
          <Button color={filter === "maintenance" ? "primary" : "secondary"} onClick={() => setFilter("maintenance")}>
            Mantenimiento
          </Button>
        </ButtonGroup>
        
        <Button color="success" onClick={handleCreate}>
          Nueva Bomba
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p>Cargando bombas...</p>
        </div>
      ) : (
        <Table striped responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>Cantidad (gal)</th>
              <th>Encargado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bombs.map((pump, index) => (
              <tr key={pump.bombId || index}>
                <td>{pump.bombNumber}</td>
                <td>{pump.servedQuantity}</td>
                <td>{pump.employeeInCharge?.employeeName || "N/A"}</td>
                <td>{getStatusBadge(pump.status)}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Button color="warning" onClick={() => handleEdit(pump)}>
                      Editar
                    </Button>
                    <Button color="danger" onClick={() => handleDelete(pump.bombId)}>
                      Eliminar
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <PumpStatusForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        initialData={selectedPump}
        refreshList={loadPumps}
      />
    </div>
  );
}