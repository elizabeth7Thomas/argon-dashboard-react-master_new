//src/Gasoline/Deposits/DepositList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner } from "reactstrap";

export default function DepositListGeneral({ onEdit, onDelete }) {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No se encontró un token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: {
              uri: "generalDeposit/list"
            },
            request: {}
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const data = response.data?.response?.data;

        if (Array.isArray(data)) {
          setDeposits(data);
        } else {
          setError("La respuesta del broker no contiene una lista válida de depósitos");
        }
      } catch (err) {
        console.error("Error al obtener depósitos:", err);
        setError("Error al conectar con el broker");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <Table bordered responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Combustible</th>
          <th>Capacidad Máxima</th>
          <th>Cantidad Actual</th>
          <th>Encargado</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {deposits.map((d, i) => (
          <tr key={d.generalDepositId}>
            <th scope="row">{i + 1}</th>
            <td>{d.fuel?.fuelName || "N/D"}</td>
            <td>{d.maxCapacity} gal</td>
            <td>{d.currentCapacity} gal</td>
            <td>{d.createdBy?.employeeName || "N/A"}</td>
            <td>{d.status ? "Activo" : "Inactivo"}</td>
            <td>
              <Button
                size="sm"
                color="info"
                className="mr-2"
                onClick={() => onEdit(d)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => onDelete(d.generalDepositId)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
