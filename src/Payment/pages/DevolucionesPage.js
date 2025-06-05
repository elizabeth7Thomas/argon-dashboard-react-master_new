// src/Payment/Devoluciones/DevolucionesPage.js 
import React, { useState, useEffect } from "react";
import axios from "axios";
import DevolucionesList from "../Devoluciones/DevolucionList";
import DevolucionForm from "../Devoluciones/DevolucionForm";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";

export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [busquedaNo, setBusquedaNo] = useState("");

  const token = localStorage.getItem("token");

  // Obtener todas las devoluciones (con filtro opcional de fechas)
  const fetchDevoluciones = async () => {
    setLoading(true);
    try {
      const payload = {
        metadata: { uri: "pagos/devoluciones/obtener" },
        request: {
          fechaInicio,
          fechaFinal,
        }
      };

      const { data } = await axios.post("http://64.23.169.22:3761/broker/api/rest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setDevoluciones(data.response || []);
    } catch (error) {
      alert("Error al obtener las devoluciones");
    } finally {
      setLoading(false);
    }
  };

  // Obtener devolución por número específico
  const fetchDevolucionPorNumero = async () => {
    if (!busquedaNo) {
      alert("Ingresa un número de devolución para buscar");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        metadata: { uri: `pagos/devoluciones/obtener/${busquedaNo}` },
        request: {}
      };

      const { data } = await axios.post("http://64.23.169.22:3761/broker/api/rest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Suponiendo que la respuesta trae un solo objeto o null
      if (data.response) {
        setDevoluciones([data.response]);
      } else {
        setDevoluciones([]);
        alert("No se encontró la devolución");
      }
    } catch (error) {
      alert("Error al buscar la devolución");
    } finally {
      setLoading(false);
    }
  };

  // Cargar todas las devoluciones al iniciar
  useEffect(() => {
    fetchDevoluciones();
  }, []);

  // Callback para recargar la lista después de crear
  const onCreacionExitosa = () => {
    fetchDevoluciones();
  };

  return (
    <div>
      <h2>Gestión de Devoluciones</h2>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Input
          type="date"
          placeholder="Fecha inicio"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Fecha final"
          value={fechaFinal}
          onChange={e => setFechaFinal(e.target.value)}
        />
        <Button color="primary" onClick={fetchDevoluciones}>Filtrar por fecha</Button>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <InputGroup style={{ maxWidth: 300 }}>
          <Input
            placeholder="Buscar por NoDevolución"
            value={busquedaNo}
            onChange={e => setBusquedaNo(e.target.value)}
          />
          <InputGroupAddon addonType="append">
            <Button color="secondary" onClick={fetchDevolucionPorNumero}>Buscar</Button>
          </InputGroupAddon>
        </InputGroup>
        <Button color="success" onClick={() => setFormOpen(true)}>Nueva Devolución</Button>
      </div>

      {loading ? <p>Cargando devoluciones...</p> : <DevolucionesList devoluciones={devoluciones} />}

      <DevolucionForm
        isOpen={formOpen}
        toggle={() => setFormOpen(false)}
        onSuccess={onCreacionExitosa}
      />
    </div>
  );
}
