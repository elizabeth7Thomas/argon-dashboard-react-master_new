import React, { useState } from "react";
import { Table, Button } from "reactstrap";
import OrdenForm from "./OrdenForm";

const OrdenList = ({
  ordenes,
  onVerDetalles,
  onCrearOrden,
  onEditarOrden,
  onEliminarOrden,
  estadosDetalles,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  // Abrir modal para nueva orden
  const handleNuevaOrden = () => {
    setOrdenSeleccionada(null);
    setModalOpen(true);
  };

  // Abrir modal para editar orden
  const handleEditar = (orden) => {
    setOrdenSeleccionada(orden);
    setModalOpen(true);
  };

  // Guardar (crear o editar)
  const handleGuardar = (ordenData) => {
    if (ordenSeleccionada) {
      onEditarOrden(ordenSeleccionada.id, ordenData);
    } else {
      onCrearOrden(ordenData);
    }
    setModalOpen(false);
  };

  // Eliminar
  const handleEliminar = (orden) => {
    if (window.confirm("¿Seguro que deseas eliminar esta orden?")) {
      onEliminarOrden(orden.id);
    }
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-end">
        <Button color="primary" onClick={handleNuevaOrden}>
          Nueva Orden
        </Button>
      </div>
      <Table className="align-items-center table-flush" responsive hover>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Servicio</th>
            <th>Proveedor</th>
            <th>Costo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.length > 0 ? (
            ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.id}</td>
                <td>{orden.fecha_orden}</td>
                <td>{orden.servicio?.nombre || "N/A"}</td>
                <td>
                  {orden.proveedor?.nombres} {orden.proveedor?.apellidos}
                </td>
                <td>${orden.costo_total}</td>
                <td>{orden.estado_orden?.nombre || "Desconocido"}</td>
                <td>
                  <Button
                    color="info"
                    size="sm"
                    className="mr-2"
                    onClick={() => onVerDetalles(orden)}
                  >
                    Ver
                  </Button>
                  <Button
                    color="warning"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditar(orden)}
                  >
                    Editar
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleEliminar(orden)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No se encontraron órdenes
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* Modal para crear/editar orden */}
      {modalOpen && (
        <OrdenForm
          orden={ordenSeleccionada}
          estadosDetalles={estadosDetalles}
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
          onSave={handleGuardar}
        />
      )}
    </>
  );
};

export default OrdenList;