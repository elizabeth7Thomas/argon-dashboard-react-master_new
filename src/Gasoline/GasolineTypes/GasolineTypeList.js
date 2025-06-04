import React, { useEffect, useState } from "react";
import { Card, CardBody, Table, Button, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function GasolineTypeList({ fuels, onEdit, onDelete }) {
  if (!fuels.length > 0) return <Spinner />;

  return (
    <Card className="shadow">
      <CardBody>
        <Table responsive>
          <thead>
            <tr>
              <th>Nombre del Combustible</th>
              <th>Costo por Galón</th>
              <th>Precio de Venta</th>
              <th>Encargado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fuels.length > 0 ? (
              fuels.map((fuel) => (
                <tr key={fuel.fuelId}>
                  <td>{fuel.fuelName}</td>
                  <td>${fuel.costPriceGalon}</td>
                  <td>${fuel.salePriceGalon}</td>
                  <td>{fuel.createdBy?.employeeName || "Desconocido"}</td>
                  <td>{fuel.status ? "Activo" : "Inactivo"}</td>
                  <td>
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => onEdit(fuel)}
                      className="mr-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => onDelete(fuel.fuelId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No hay registros de gasolina
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
