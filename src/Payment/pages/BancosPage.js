import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Alert, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import { handleBrokerError } from "../utils/apiErrorHandler";

export default function BancosPage() {
  const [bancos, setBancos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBancos = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/bancos/obtener" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Verificar si la respuesta del broker indica error
      if (response.data?.response?._broker_status !== 200) {
        throw {
          response: {
            data: response.data
          }
        };
      }

      const data = response.data?.response?.data?.Bancos;
      setBancos(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorMessage = handleBrokerError(error);
      console.error("Error en fetchBancos:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (banco) => {
    if (!window.confirm(`¿Está seguro de eliminar ${banco.nombre}?`)) return;
    
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: `pagos/bancos/eliminar/${banco._id}` },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Verificar respuesta del broker
      if (response.data?.response?._broker_status !== 200) {
        throw {
          response: {
            data: response.data
          }
        };
      }

      toast.success(`${banco.nombre} eliminado correctamente`);
      fetchBancos();
    } catch (error) {
      const errorMessage = handleBrokerError(error);
      console.error("Error en handleDelete:", error);
      toast.error(errorMessage);
      
      // Mostrar detalles completos del error en consola para depuración
      if (error.response?.data) {
        console.log("Respuesta completa del error:", error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchBancos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Bancos</h2>
      
      {error && (
        <Alert color="danger" toggle={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p>Cargando bancos...</p>
        </div>
      ) : (
        <>
          <Button color="primary" className="mb-3" onClick={() => {}}>
            Crear Banco
          </Button>
          
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bancos.map(banco => (
                <tr key={banco._id}>
                  <td>{banco.nombre}</td>
                  <td>
                    <Button 
                      color="danger" 
                      size="sm" 
                      onClick={() => handleDelete(banco)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}