//src/Payment/MetodosPago/// MetodoPagoList.js
import React from "react";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function MetodoPagoList({ metodos, onView, onEdit, onDelete }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Método</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {metodos.length === 0 ? (
          <tr>
            <td colSpan="3">No se encontraron métodos</td>
          </tr>
        ) : (
          metodos.map((metodo) => (
            <tr key={metodo.idMetodo}>
              <td>{metodo.idMetodo}</td>
              <td>{metodo.Metodo}</td>
              <td>
                <Button
                  size="sm"
                  color="info"
                  className="me-2"
                  onClick={() => onView(metodo)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  className="me-2"
                  onClick={() => onEdit(metodo)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => onDelete(metodo)}
                >
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