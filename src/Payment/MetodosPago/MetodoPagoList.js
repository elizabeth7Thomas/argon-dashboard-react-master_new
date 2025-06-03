import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function MetodosList({ metodos, onView }) {
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
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default function MetodosForm() {
  const [metodos, setMetodos] = useState([]);

  useEffect(() => {
    const fetchMetodos = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "pagos/metodos/obtener" }, // sin slash inicial
            request: {
              
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data?.response?.data;

        if (Array.isArray(data)) {
          setMetodos(data);
        } else {
          console.warn("La respuesta del servidor no contiene una lista válida de métodos.");
          setMetodos([]);
        }
      } catch (error) {
        console.error("Error al cargar los métodos:", error);
        alert("Error al cargar los métodos");
      }
    };

    fetchMetodos();
  }, []);

  const handleView = (metodo) => {
    alert(`Viendo método: ${metodo.Metodo}`);
  };

  return (
    <div className="container mt-4">
      <h2>Lista de métodos</h2>
      <MetodosList metodos={metodos} onView={handleView} />
    </div>
  );
}
