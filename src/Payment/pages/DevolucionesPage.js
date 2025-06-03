import React, { useState, useEffect } from "react";
import {
  Container, Button, Row, Col, Form, FormGroup, Label, Input
} from "reactstrap";
import axios from "axios";
import DevolucionesList from "../Devoluciones/DevolucionList";
import DevolucionForm from "../Devoluciones/DevolucionForm";

export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const token = localStorage.getItem("token");

  const fetchDevoluciones = async () => {
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/devoluciones/obtener" },
          request: {
            fechaInicio,
            fechaFinal
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setDevoluciones(response.data.Devoluciones || []);
    } catch (err) {
      alert("Error al obtener devoluciones");
    }
  };

  useEffect(() => {
    fetchDevoluciones();
  }, []);

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h4>Devoluciones</h4>
        </Col>
        <Col className="text-end">
          <Button color="success" onClick={() => setModalOpen(true)}>
            Nueva Devolución
          </Button>
        </Col>
      </Row>
      <Form inline onSubmit={(e) => {
        e.preventDefault();
        fetchDevoluciones();
      }}>
        <Row className="mb-3">
          <Col md={4}>
            <FormGroup>
              <Label for="fechaInicio">Fecha Inicio</Label>
              <Input type="date" id="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="fechaFinal">Fecha Final</Label>
              <Input type="date" id="fechaFinal" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} />
            </FormGroup>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button type="submit" color="primary">Filtrar</Button>
          </Col>
        </Row>
      </Form>

      <DevolucionesList devoluciones={devoluciones} />
      <DevolucionForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onSuccess={fetchDevoluciones}
      />
    </Container>
  );
}
