import React, { useEffect, useState } from "react";
import axios from "axios";
import routes from "../routes";
import AreaList from "../Areas/AreaList";
import AreaForm from "../Areas/AreaForm";
import { Button } from "reactstrap";

export default function PageAreasAdmin() {
  const [areas, setAreas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [areaEditar, setAreaEditar] = useState(null);

  // Modal de confirmación de borrado
  const [showModal, setShowModal] = useState(false);
  const [areaAEliminar, setAreaAEliminar] = useState(null);

  const fetchAreas = async () => {
    try {
      const res = await axios.get(routes.Administracion.Areas.GET_ALL);
      setAreas(res.data.areas || []);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleGuardar = async (form) => {
    try {
      if (areaEditar) {
        // PATCH para editar (ajusta si tienes un endpoint diferente)
        await axios.patch(
          routes.Administracion.Areas.DELETE(areaEditar.id),
          form
        );
      } else {
        // POST para crear
        await axios.post(routes.Administracion.Areas.CREATE, form);
      }
      setModalOpen(false);
      setAreaEditar(null);
      fetchAreas();
    } catch (error) {
      console.error("Error al guardar área:", error);
    }
  };

  const handleEditar = (area) => {
    setAreaEditar(area);
    setModalOpen(true);
  };

  const handleEliminar = (area) => {
    setAreaAEliminar(area);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!areaAEliminar) return;
    try {
      await axios.patch(
        routes.Administracion.Areas.DELETE(areaAEliminar.id),
        { eliminado: true }
      );
      setShowModal(false);
      setAreaAEliminar(null);
      fetchAreas();
    } catch (error) {
      console.error("Error al eliminar área:", error);
    }
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-end">
        <Button
          color="primary"
          onClick={() => {
            setAreaEditar(null);
            setModalOpen(true);
          }}
        >
          Nueva Área
        </Button>
      </div>
      <AreaList
        areas={areas}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
      <AreaForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        onGuardar={handleGuardar}
        areaEditar={areaEditar}
      />
      {/* Modal de confirmación de borrado */}
      {showModal && (
        <div className="modal-backdrop show">
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowModal(false)}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    ¿Seguro que deseas eliminar el área{" "}
                    <strong>{areaAEliminar?.nombre}</strong>?
                  </p>
                </div>
                <div className="modal-footer">
                  <Button color="danger" onClick={confirmarEliminar}>
                    Eliminar
                  </Button>
                  <Button color="secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}