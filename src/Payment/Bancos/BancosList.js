import React from "react";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function BancoList({ bancos = [], onDelete }) {
  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Transacciones</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {bancos.length > 0 ? (
          bancos.map((banco) => (
            <tr key={banco._id}>
              <td>{banco.nombre}</td>
              <td>{banco.totalTransacciones}</td>
              <td>{banco.estado === 0 ? "Activo" : "Inactivo"}</td>
              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => onDelete(banco._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No hay bancos registrados
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default BancoList;