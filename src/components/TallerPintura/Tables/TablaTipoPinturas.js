import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card, Container } from "reactstrap";

const TablaTipoPinturas = () => {
  const [tiposPintura, setTiposPintura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerTiposPinturas = async () => {
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
            uri: "pintura/GET/tipospinturas", // Asegúrate que esta URI sea la correcta
          },
          request: {},
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response?.data?.response?.data;

      if (data) {
        const TiposPinturaArray = Array.isArray(data) ? data : [data];
        setTiposPintura(TiposPinturaArray);
      } else {
        setError("La respuesta del broker no tiene datos válidos");
      }
    } catch (err) {
      console.error("Error al obtener los tipos de pintura:", err);
      setError("Error al conectar con el broker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTiposPinturas();
  }, []);

  return (
    <Container className="mt-4" fluid>
      <Card className="shadow p-4">
        <h3>Tipos de Pintura</h3>
        <Table responsive>
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Nombre del Tipo de Pintura</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="text-center">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="2" className="text-danger text-center">{error}</td>
              </tr>
            ) : tiposPintura.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center">No hay tipos de pintura disponibles.</td>
              </tr>
            ) : (
              tiposPintura.map((tipo) => (
                <tr key={tipo.idTipoPintura}>
                  <td>{tipo.idTipoPintura}</td>
                  <td>{tipo.NombreTipoPintura}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default TablaTipoPinturas;
