// src/Gasoline/PumpStatus/PumpStatusList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner } from "reactstrap";

export default function PumpStatusList({ onEdit }) {
  const [bombs, setBombs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBombs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No se encontró un token de autenticación");
        setLoading(false);
        return;
      }

      try {

        const response = await axios.post("http://64.23.169.22:3761/broker/api/rest", {
          metadata: 
          { uri: "bomb/list"

          },
          request: {},
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        if (response.data && response.data.response && response.data.response.data) {
          setBombs(response.data.response.data);
        } else {
          setError("La respuesta del broker no tiene datos válidos");
        }
      } catch (err) {
        console.error("Error al obtener bombas:", err);
        setError("Error al conectar con el broker");
      } finally {
        setLoading(false);
      }
    };

    fetchBombs();
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
          <th>Bomba</th>
          <th>Cantidad Servida</th>
          <th>Encargado</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {bombs.map((pump, i) => (
          <tr key={pump.bombId}>
            <th scope="row">{i + 1}</th>
            <td>{pump.bombNumber}</td>
            <td>{pump.servedQuantity} gal</td>
            <td>{pump.employeeInCharge.employeeName}</td>
            <td>{pump.status === 1 ? 'Activo' : 'Inactivo'}</td>
            <td>
              <Button size="sm" color="warning" onClick={() => onEdit(pump)}>
                Editar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
