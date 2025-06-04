import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

function FacturaList() {
  const [facturas, setFacturas] = useState([]);

  const token = localStorage.getItem("token");

  const obtenerFacturas = async () => {
    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            uri: "pagos/facturas/obtener",
          },
          request: {}, // ← obligatorio aunque esté vacío
        }),
      });

      if (response.status === 401) {
        alert("Sesión expirada. Vuelve a iniciar sesión.");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      console.log("Datos recibidos de facturas:", data);

      const facturasRecibidas = data?.response?.data?.Facturas;
      console.log("Facturas parseadas:", facturasRecibidas);

      setFacturas(Array.isArray(facturasRecibidas) ? facturasRecibidas : []);
    } catch (error) {
      console.error("Error HTTP al obtener facturas:", error);
    }
  };

  const anularFactura = async (noFactura) => {
    if (!window.confirm(`¿Deseas anular la factura ${noFactura}?`)) return;

    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            uri: `pagos/facturas/anular/${noFactura}`,
          },
        }),
      });

      const result = await response.json();
      alert(result.response?.data?.mensaje || "Error al anular factura");
      obtenerFacturas();
    } catch (error) {
      console.error("Error al anular factura:", error);
    }
  };

  const verFactura = async (noFactura) => {
    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            uri: `pagos/facturas/obtener/${noFactura}`,
          },
          request: {},
        }),
      });

      const data = await response.json();
      const factura = data.response?.data?.factura;
      if (factura) {
        alert(`Factura #${factura.NoFactura}\nCliente: ${factura.Cliente?.NombreCliente} ${factura.Cliente?.ApellidoCliente}\nTotal: ${factura.Total}`);
      } else {
        alert("Factura no encontrada");
      }
    } catch (error) {
      console.error("Error al ver factura:", error);
    }
  };

  useEffect(() => {
    obtenerFacturas();
  }, []);

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>No. Factura</th>
          <th>Serie</th>
          <th>Empresa</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {facturas.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center">No se encontraron facturas.</td>
          </tr>
        ) : (
          facturas.map((factura) => (
            <tr key={factura.NoFactura}>
              <td>{factura.NoFactura}</td>
              <td>{factura.Serie}</td>
              <td>{factura.Empresa?.NombreEmpresa}</td>
              <td>{new Date(factura.Fecha).toLocaleDateString()}</td>
              <td>{factura.Total}</td>
              <td>{factura.Estado === 0 ? "Activa" : "Anulada"}</td>
              <td>
                <Button size="sm" color="info" className="me-2" onClick={() => verFactura(factura.NoFactura)}>
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                <Button size="sm" color="danger" onClick={() => anularFactura(factura.NoFactura)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default FacturaList;
