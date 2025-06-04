import React, { useState } from "react";
import { Input, Button, Form, FormGroup, Label, Alert } from "reactstrap";
import axios from "axios";

export default function BuscarClientePorNit({ onFound }) {
  const [nit, setNit] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/clientes/obtener/${nit}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onFound(response.data.response.cliente);
      setMensaje(null);
    } catch (error) {
      const msg = error?.response?.data?.mensaje || "Error al buscar cliente";
      setMensaje(msg);
    }
  };

  return (
    <Form inline onSubmit={handleBuscar} className="mb-3">
      <FormGroup>
        <Label for="buscarNit" className="me-2">Buscar NIT</Label>
        <Input
          id="buscarNit"
          type="text"
          value={nit}
          onChange={(e) => setNit(e.target.value)}
          placeholder="Ingrese NIT"
        />
      </FormGroup>
      <Button color="primary" className="ms-2" type="submit">Buscar</Button>
      {mensaje && <Alert color="danger" className="mt-2">{mensaje}</Alert>}
    </Form>
  );
}
