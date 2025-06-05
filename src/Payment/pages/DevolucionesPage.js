// src/Payment/Devoluciones/DevolucionesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DevolucionesList from "../Devoluciones/DevolucionList";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";

export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [busquedaNo, setBusquedaNo] = useState("");

  const token = localStorage.getItem("token");

  const fetchDevoluciones = async () => {
    setLoading(true);
    try {
      const payload = {
        metadata: {
          uri: "/pagos/devoluciones/obtener",
          _broker_client_id: "18",
          _broker_client_name: "rosmerythomas.9073"
        },
        request: {
          fechaInicio,
          fechaFinal
        }
      };

      const { data } = await axios.post("http://64.23.169.22:3761/broker/api/rest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const devols = data?.response?.data?.Devoluciones || [];
      setDevoluciones(devols);
    } catch (err) {
      alert("Error al obtener devoluciones: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevolucionPorNumero = () => {
    if (!busquedaNo.trim()) {
      alert("Ingresa un número de devolución válido.");
      return;
    }
    const resultado = devoluciones.find(d => String(d.NoDevolucion) === busquedaNo);
    if (resultado) {
      setDevoluciones([resultado]);
    } else {
      alert("Devolución no encontrada.");
    }
  };

  useEffect(() => {
    fetchDevoluciones();
  }, []);

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
      </div>

      {loading ? <p>Cargando devoluciones...</p> : <DevolucionesList devoluciones={devoluciones} />}
    </div>
  );
}
