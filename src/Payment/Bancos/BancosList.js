//src/Payment/Bancos/BancosList.js
import React from "react";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

function BancoList({ bancos = [], onEdit, onDelete, onView }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Total Transacciones</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {!Array.isArray(bancos) || bancos.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center">No se encontraron bancos.</td>
          </tr>
        ) : (
          bancos.map((banco) => (
            <tr key={banco._id}>
              <td>{banco.nombre || "—"}</td>
              <td>{banco.totalTransacciones ?? 0}</td>
              <td>{banco.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <Button size="sm" color="info" className="me-2" onClick={() => onView(banco)}>
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                <Button size="sm" color="warning" className="me-2" onClick={() => onEdit(banco)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button size="sm" color="danger" onClick={() => onDelete(banco)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default BancoList;
