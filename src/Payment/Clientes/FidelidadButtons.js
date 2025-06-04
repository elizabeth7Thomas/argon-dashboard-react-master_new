import React from "react";
import { Button } from "reactstrap";
import axios from "axios";

export default function FidelidadButtons({ clienteId, refresh }) {
  const token = localStorage.getItem("token");

  const crearTarjeta = async () => {
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/cliente/fidelidad/crear/${clienteId}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.response.mensaje);
      refresh();
    } catch (error) {
      const mensaje = error?.response?.data?.mensaje || "Error al crear tarjeta";
      alert(mensaje);
    }
  };

  const desactivarTarjeta = async () => {
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/cliente/fidelidad/desactivar/${clienteId}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.response.mensaje);
      refresh();
    } catch (error) {
      const mensaje = error?.response?.data?.mensaje || "Error al desactivar tarjeta";
      alert(mensaje);
    }
  };

  return (
    <>
      <Button color="success" size="sm" onClick={crearTarjeta} className="me-2">
        Crear Tarjeta
      </Button>
      <Button color="warning" size="sm" onClick={desactivarTarjeta}>
        Desactivar Tarjeta
      </Button>
    </>
  );
}
