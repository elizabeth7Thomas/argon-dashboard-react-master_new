// src/Payment/pages/MetodosPagoPage.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";


import MetodoPagoForm from "../MetodosPago/MetodoPagoForm";
import MetodoPagoList from "../MetodosPago/MetodoPagoList";
import MetodoPagoDetail from "../MetodosPago/MetodoPagoDetail";

export default function MetodosPagoPage() {
  // Estados principales:
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Para crear/editar:
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState(null);

  // Para detalle:
  const [detailOpen, setDetailOpen] = useState(false);

  // Para formulario:
  const [formData, setFormData] = useState({ Metodo: "" });
  const [idMetodoEdit, setIdMetodoEdit] = useState(null);

  // Para búsqueda por ID:
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const token = localStorage.getItem("token");

  // ───► FUNCIONES PARA LLAMADAS AL BACKEND

  // 1) Obtener todos
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/metodos/obtener" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = resp.data?.response?.data;
      if (Array.isArray(data)) {
        setMetodos(data);
      } else {
        setMetodos([]);
      }
    } catch (err) {
      console.error("Error al obtener métodos:", err);
      setError("Error al cargar los métodos.");
      setMetodos([]);
    } finally {
      setLoading(false);
    }
  };

  // 2) Obtener por ID
  const fetchById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const resp = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/metodos/obtener/${id}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const metodo = resp.data?.response?.data;
      if (metodo && metodo.idMetodo) {
        setMetodos([metodo]);
      } else {
        setMetodos([]);
        setError(`No se encontró ningún método con ID ${id}.`);
      }
    } catch (err) {
      console.error(`Error al obtener método ${id}:`, err);
      setError(`Error al buscar el método con ID ${id}.`);
      setMetodos([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // 3) Eliminar lógicamente
  const handleDelete = async (metodo) => {
    const confirm = window.confirm(
      `¿Estás seguro que deseas eliminar el método "${metodo.Metodo}"?`
    );
    if (!confirm) return;

    try {
      await axios.put(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/metodo/eliminar/${metodo.idMetodo}` }, // Notar el uso de "metodo" en singular
          request: {} // Se incluye un objeto request, aunque esté vacío
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Luego de eliminar, se refresca la lista:
      if (searchTerm.trim()) {
        fetchById(searchTerm.trim());
      } else {
        fetchAll();
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el método.");
    }
  };

  // 4) Manejo de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      // Si no hay término, recargamos todo
      fetchAll();
    } else {
      setSearching(true);
      fetchById(searchTerm.trim());
    }
  };

  // 5) Apertura del modal para crear
  const handleCreate = () => {
    setIsEditing(false);
    setFormData({ Metodo: "" });
    setIdMetodoEdit(null);
    setModalOpen(true);
  };

  // 6) Apertura del modal para editar
  const handleEdit = (metodo) => {
    setIsEditing(true);
    setFormData({ Metodo: metodo.Metodo });
    setIdMetodoEdit(metodo.idMetodo);
    setModalOpen(true);
  };

  // 7) Apertura de detalle
  const handleView = (metodo) => {
    setSelectedMetodo(metodo);
    setDetailOpen(true);
  };

  // 8) Manejo de envío del formulario para crear o actualizar
  const handleFormSubmit = async () => {
    setLoading(true);
    if (isEditing) {
      // Actualización
      try {
        await axios.put(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: `pagos/metodos/actualizar/${idMetodoEdit}` },
            request: {
              Metodo: formData.Metodo,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setModalOpen(false);
      } catch (err) {
        console.error("Error al actualizar el método:", err);
        alert("No se pudo actualizar el método.");
      } finally {
        setLoading(false);
        // Refrescamos la lista, ya sea con búsqueda específica o completa
        if (searchTerm.trim()) {
          fetchById(searchTerm.trim());
        } else {
          fetchAll();
        }
      }
    } else {
      // Creación
      try {
        await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "pagos/metodos/crear" },
            request: {
              Metodo: formData.Metodo,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setModalOpen(false);
      } catch (err) {
        console.error("Error al crear el método:", err);
        alert("No se pudo crear el método.");
      } finally {
        setLoading(false);
        if (searchTerm.trim()) {
          fetchById(searchTerm.trim());
        } else {
          fetchAll();
        }
      }
    }
  };

  // ───► useEffect para cargar todo al montar
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <br />
      <br />
      <br />
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
                {error && (
                  <p className="text-danger small mt-1">{error}</p>
                )}
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
      </Container>

      <MetodoPagoForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
        idMetodo={idMetodoEdit}
      />

      <MetodoPagoDetail
        isOpen={detailOpen}
        toggle={() => setDetailOpen(!detailOpen)}
        metodo={selectedMetodo}
      />
    </>
  );
}
