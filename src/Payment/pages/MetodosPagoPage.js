import React, { useState, useEffect } from "react";
import {
  Container, Card, CardBody, Button, Input, InputGroup, Row, Col
} from "reactstrap";
import axios from "axios";
import MetodoPagoForm from "../MetodosPago/MetodoPagoForm";
import MetodoPagoList from "../MetodosPago/MetodoPagoList";
import MetodoPagoDetail from "../MetodosPago/MetodoPagoDetail";
import { handleBrokerError } from "../utils/apiErrorHandler";

export default function MetodosPagoPage() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formData, setFormData] = useState({ Metodo: "" });
  const [idMetodoEdit, setIdMetodoEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        { metadata: { uri: "pagos/metodos/obtener" }, request: {} },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const data = resp.data?.response?.data;
      setMetodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener métodos:", err);
      const msg = handleBrokerError(err);
      setError(msg);
      setMetodos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const resp = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        { metadata: { uri: `pagos/metodos/obtener/${id}` }, request: {} },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const metodo = resp.data?.response?.data;
      setMetodos(metodo && metodo.idMetodo ? [metodo] : []);
      if (!metodo || !metodo.idMetodo) setError(`No se encontró ningún método con ID ${id}.`);
    } catch (err) {
      console.error(`Error al obtener método ${id}:`, err);
      const msg = handleBrokerError(err);
      setError(msg);
      setMetodos([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleDelete = async (metodo) => {
    const confirm = window.confirm(`¿Estás seguro que deseas eliminar el método "${metodo.Metodo}"?`);
    if (!confirm) return;

    try {
      await axios.put(
        "http://64.23.169.22:3761/broker/api/rest",
        { metadata: { uri: `pagos/metodos/eliminar/${metodo.idMetodo}` }, request: {} },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      searchTerm.trim() ? fetchById(searchTerm.trim()) : fetchAll();
    } catch (err) {
      console.error("Error al eliminar:", err);
      const msg = handleBrokerError(err);
      alert(msg); // 👈 muestra el _broker_message_
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ Metodo: "" });
    setIdMetodoEdit(null);
    setModalOpen(true);
  };

  const handleEdit = (metodo) => {
    setIsEditing(true);
    setFormData({ Metodo: metodo.Metodo });
    setIdMetodoEdit(metodo.idMetodo);
    setModalOpen(true);
  };

  const handleView = (metodo) => {
    setSelectedMetodo(metodo);
    setDetailOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const uri = isEditing
        ? `pagos/metodos/actualizar/${idMetodoEdit}`
        : "pagos/metodos/crear";

      const method = isEditing ? axios.put : axios.post;

      await method(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri },
          request: { Metodo: formData.Metodo },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setModalOpen(false);
      searchTerm.trim() ? fetchById(searchTerm.trim()) : fetchAll();
    } catch (err) {
      console.error("Error al guardar método:", err);
      const msg = handleBrokerError(err);
      alert(msg); // 👈 muestra el _broker_message_
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchAll();
    } else {
      setSearching(true);
      fetchById(searchTerm.trim());
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <Container className="mt--6" fluid>
      <Card>
        <CardBody>
          <Row className="mb-3">
            <Col md="6">
              <form onSubmit={handleSearchSubmit}>
                <InputGroup>
                  <Input
                    placeholder="Buscar por ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button color="secondary" type="submit">
                    {searching ? "Buscando..." : "Buscar"}
                  </Button>
                  <Button
                    color="light"
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      fetchAll();
                    }}
                    className="ms-2"
                  >
                    Limpiar
                  </Button>
                </InputGroup>
              </form>
              {error && <p className="text-danger small mt-1">{error}</p>}
            </Col>
            <Col md="6" className="text-end">
              <Button color="primary" onClick={handleCreate}>
                Nuevo Método de Pago
              </Button>
            </Col>
          </Row>

          {loading ? (
            <p>Cargando métodos...</p>
          ) : (
            <MetodoPagoList
              metodos={metodos}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardBody>
      </Card>

      <MetodoPagoForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
      />

      <MetodoPagoDetail
        isOpen={detailOpen}
        toggle={() => setDetailOpen(!detailOpen)}
        metodo={selectedMetodo}
      />
    </Container>
  );
}
