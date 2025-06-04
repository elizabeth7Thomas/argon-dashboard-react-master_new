import React, { useEffect, useState } from "react";
import axios from "axios";
import routes from "../routes";
import AlertaList from "../Alertas/AlertaList";
import AlertaForm from "../Alertas/AlertaForm";
import { Button } from "reactstrap";

export default function PageAlertasAdmin() {
  const [alertas, setAlertas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertaEditar, setAlertaEditar] = useState(null);

  // Modal de confirmación de borrado
  const [showModal, setShowModal] = useState(false);
  const [alertaAEliminar, setAlertaAEliminar] = useState(null);

  const fetchAlertas = async () => {
    try {
      const res = await axios.get(routes.Administracion.Alertas.GET_ALL);
      setAlertas(res.data.alertas || []);
    } catch (error) {
      console.error("Error al obtener alertas:", error);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const handleGuardar = async (form) => {
    try {
      if (alertaEditar) {
        // PATCH para editar
        await axios.patch(
          routes.Administracion.Alertas.DELETE(alertaEditar.id),
          form
        );
      } else {
        // POST según tipo
        let url = "";
        switch (form.tipo) {
          case "tienda_de_conveniencia":
            url = routes.Administracion.Alertas.CREATE_TIENDA;
            break;
          case "gasolinera":
            url = routes.Administracion.Alertas.CREATE_GAS;
            break;
          case "repuestos":
            url = routes.Administracion.Alertas.CREATE_REPUESTOS;
            break;
          case "pintura":
            url = routes.Administracion.Alertas.CREATE_PINTURA;
            break;
          default:
            url = routes.Administracion.Alertas.CREATE_TIENDA;
        }
        await axios.post(url, form);
      }
      setModalOpen(false);
      setAlertaEditar(null);
      fetchAlertas();
    } catch (error) {
      console.error("Error al guardar alerta:", error);
    }
  };

  const handleEditar = (alerta) => {
    setAlertaEditar(alerta);
    setModalOpen(true);
  };

  const handleEliminar = (alerta) => {
    setAlertaAEliminar(alerta);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!alertaAEliminar) return;
    try {
      await axios.patch(
        routes.Administracion.Alertas.DELETE(alertaAEliminar.id),
        { eliminado: true }
      );
      setShowModal(false);
      setAlertaAEliminar(null);
      fetchAlertas();
    } catch (error) {
      console.error("Error al eliminar alerta:", error);
    }
  };

  const handleAgregar = () => {
    setAlertaEditar(null); // Limpiar edición
    setModalOpen(true); // Abrir modal
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-end">
        <Button color="primary" onClick={handleAgregar}>
          Agregar Alerta
        </Button>
      </div>
      <AlertaList
        alertas={alertas}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
      <AlertaForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        onGuardar={handleGuardar}
        alertaEditar={alertaEditar}
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
                    ¿Seguro que deseas eliminar la alerta{" "}
                    <strong>{alertaAEliminar?.titulo}</strong>?
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