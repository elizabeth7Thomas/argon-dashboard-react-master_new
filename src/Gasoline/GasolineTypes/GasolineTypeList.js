import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Table, Button, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function GasolineTypeList({ onEdit, onDelete }) {
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFuels = async () => {
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
            metadata: { uri: "fuelType/list" },
            request: {},
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const brokerData = response.data?.response?.data;

        if (Array.isArray(brokerData)) {
          setFuels(brokerData);
        } else {
          setError("La respuesta del broker no contiene una lista válida");
        }
      } catch (err) {
        console.error("Error al obtener tipos de gasolina:", err);
        setError("Error al conectar con el broker");
      } finally {
        setLoading(false);
      }
    };

    fetchFuels();
  }, []);
  

  if (loading) return <Spinner />;
  if (error) return <p className="text-danger">{error}</p>;

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
