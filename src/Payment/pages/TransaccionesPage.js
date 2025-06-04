import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Row, Col, Card, CardBody,
  Input, Label, FormGroup, Button
} from "reactstrap";
import TransaccionList from "../Transacciones/TransaccionList";

export default function TransaccionesPage() {
  const [transacciones, setTransacciones] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFinal: "",
  });

  const fetchTransacciones = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/transacciones/obtener" },
          request: {},
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

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = () => {
    fetchTransacciones();
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4>Transacciones</h4>
              <Row className="mb-3">
                <Col md="4">
                  <FormGroup>
                    <Label for="fechaInicio">Fecha Inicio</Label>
                    <Input
                      type="date"
                      id="fechaInicio"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label for="fechaFinal">Fecha Final</Label>
                    <Input
                      type="date"
                      id="fechaFinal"
                      name="fechaFinal"
                      value={filtros.fechaFinal}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="4" className="d-flex align-items-end">
                  <Button color="primary" onClick={handleBuscar}>
                    Buscar
                  </Button>
                </Col>
              </Row>
              <TransaccionList transacciones={transacciones} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
