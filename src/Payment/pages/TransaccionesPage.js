// src/Payment/pages/TransaccionesPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Input, FormGroup } from "reactstrap";
import TransaccionList from "../Transacciones/TransaccionList";
import TransaccionForm from "../Transacciones/TransaccionForm";

const TransaccionesPage = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFinal: "",
  });

  const token = localStorage.getItem("token");

  const fetchTransacciones = async () => {
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/transacciones/obtener" },
          request: {
            fechaInicio: filtros.fechaInicio,
            fechaFinal: filtros.fechaFinal,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
     
      const data = response.data?.response?.data?.Transacciones;
      setTransacciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener transacciones:", error);
      alert("Hubo un error al cargar las transacciones.");
    }
  };

 

  const anularTransaccion = async (noTransaccion) => {
    try {
      await axios.put(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/transaccion/anular/${noTransaccion}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ); 
      alert("Transacción anulada correctamente.");
      fetchTransacciones();
    } catch (err) {
      console.error("Error al anular transacción:", err);
      alert("No se pudo anular la transacción.");
    }
  };

  
  useEffect(() => {
    fetchTransacciones();
    
  }, []);

  
  const handleCrearClick = () => {
    setTransaccionSeleccionada(null);
    setMostrarFormulario(true);
  };


  const handleGuardar = () => {
    setMostrarFormulario(false);
    fetchTransacciones();
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Gestión de Transacciones</h1>

      <Row className="mb-3">
        <Col md={3}>
          <FormGroup>
            <Input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) =>
                setFiltros({ ...filtros, fechaInicio: e.target.value })
              }
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Input
              type="date"
              value={filtros.fechaFinal}
              onChange={(e) =>
                setFiltros({ ...filtros, fechaFinal: e.target.value })
              }
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <Button color="primary" onClick={fetchTransacciones}>
            Filtrar
          </Button>
        </Col>
    
      </Row>

      <TransaccionList
        transacciones={transacciones}
        onAnular={anularTransaccion}
      />

      {mostrarFormulario && (
        <TransaccionForm
          transaccion={transaccionSeleccionada}
          onClose={() => setMostrarFormulario(false)}
          onSave={handleGuardar}
        />
      )}
    </Container>
  );
};

export default TransaccionesPage;
