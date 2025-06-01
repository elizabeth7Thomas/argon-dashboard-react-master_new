import React, { useEffect, useState } from "react";
import axios from "axios";
import routes from "../routes";
import ProveedorList from "../Proveedores/ProveedorList";
import ProveedorForm from "../Proveedores/ProveedorForm";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import Ordenes from "./PageOrdenesAdmin";

export default function PageProveedoresAdmin() {
  const [proveedores, setProveedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [proveedorEditar, setProveedorEditar] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

  const [showOrdenes, setShowOrdenes] = useState(false);

  const fetchProveedores = async () => {
    try {
      const res = await axios.get(routes.Administracion.Proveedores.GET_ALL);
      setProveedores(res.data.proveedores || []);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleGuardar = async (form) => {
    try {
      if (proveedorEditar) {
        await axios.put(
          routes.Administracion.Proveedores.UPDATE(proveedorEditar.id),
          form
        );
      } else {
        await axios.post(routes.Administracion.Proveedores.CREATE, form);
      }
      setModalOpen(false);
      setProveedorEditar(null);
      fetchProveedores();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    }
  };

  const handleEditar = (proveedor) => {
    setProveedorEditar(proveedor);
    setModalOpen(true);
  };

  const handleEliminar = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!proveedorAEliminar) return;
    try {
      await axios.patch(
        routes.Administracion.Proveedores.DELETE(proveedorAEliminar.id),
        { eliminado: true }
      );
      setShowModal(false);
      setProveedorAEliminar(null);
      fetchProveedores();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
    }
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-between">
        <Button
          color="primary"
          onClick={() => {
            setProveedorEditar(null);
            setModalOpen(true);
          }}
        >
          Nuevo Proveedor
        </Button>
        <Button
          color="primary"
          onClick={() => setShowOrdenes((prev) => !prev)}
          className="btn-icon"
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
          Órdenes
        </Button>
      </div>
      <ProveedorList
        proveedores={proveedores}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
      <ProveedorForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        onGuardar={handleGuardar}
        proveedorEditar={proveedorEditar}
      />
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
                    ¿Seguro que deseas eliminar el proveedor{" "}
                    <strong>{proveedorAEliminar?.nombre}</strong>?
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
      {showOrdenes && (
        <div className="mt-4">
          <Ordenes />
        </div>
      )}
    </>
  );
}