// src/Gasoline/Sales/SaleList.js
import React from "react";
import { Table, Button, Badge } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfo } from "@fortawesome/free-solid-svg-icons";

export default function SaleList({ sales, onEdit, onShow }) {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Combustible</th>
          <th>Cantidad (G)</th>
          <th>Fecha</th>
          <th>Monto ($)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale) => (
          <tr key={sale.id}>
            <td>{sale.fuel.fuelName}</td>
            <td>{Number(sale.consumedQuantity).toFixed(4)}</td>
            <td>
              {sale.createdAt
                ? new Date(sale.createdAt).toLocaleString()
                : "Sin fecha"}
            </td>

            <td>
              <Badge color="success">
                $
                {typeof sale.amount === "number"
                  ? sale.amount.toFixed(2)
                  : "0.00"}
              </Badge>
            </td>
            <td>
              <Button
                color="info"
                size="sm"
                onClick={() => onShow(sale)}
                className="mr-2"
              >
                <FontAwesomeIcon icon={faInfo} />
              </Button>
              {(sale.status === 2 || sale.status === 4) && (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => onEdit(sale)}
                  className="mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
