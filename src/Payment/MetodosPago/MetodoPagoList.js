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
            <tr key={metodo._id}>
              <td>{metodo._id}</td>
              <td>{metodo.metodo}</td>
              <td>
                <Button size="sm" color="info" className="me-2" onClick={() => onView(metodo)}>
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
      try {
        const response = await axios.get("http://localhost:3001/pagos/metodos/obtener", {
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        console.log("Respuesta del servidor", response);
        console.log("Métodos recibidos", response.data.Metodos); // corregido a 'Metodos'

        if (response.status === 200 && response.data && Array.isArray(response.data.Metodos)) {
          setMetodos(response.data.Metodos); // corregido a 'Metodos'
        } else {
          console.warn("La respuesta del servidor no contiene la lista esperada de métodos.");
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
    alert(`Viendo método: ${metodo.metodo}`);
  };

  return (
    <div className="container mt-4">
      <h2>Lista de métodos</h2>
      <MetodosList
        metodos={metodos}
        onView={handleView}
      />
    </div>
  );
}
