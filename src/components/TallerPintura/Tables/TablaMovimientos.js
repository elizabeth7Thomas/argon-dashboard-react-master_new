import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Container,
} from "reactstrap";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaMovimientos = ({ onEditarClick = () => {}, onVerClick = () => {} }) => {
  const [movimientos, setMovimientos] = useState([]);

  const obtenerMovimientos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/movimiento",
            _broker_client_id: "4",
            _broker_client_name: "joseserra.4567",
          },
          request: {},
        }),
      });

      if (!res.ok) throw new Error("Error al obtener movimientos");

      const json = await res.json();
      const data = json?.response?.data || [];
      setMovimientos(data.filter((m) => !m.deleted)); // excluye eliminados lógicamente
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      setMovimientos([]);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  return (
    <Container className="mt-4" fluid>
      <Card className="shadow mb-3 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <h3 className="mb-0">Listado de Movimientos</h3>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table className="table-bordered table-hover table-striped mb-0" responsive>
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Tipo Movimiento</th>
                <th>Cantidad</th>
                <th>Fecha Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay movimientos registrados
                  </td>
                </tr>
              ) : (
                movimientos.map((mov, index) => (
                  <tr key={mov.idMovimiento}>
                    <td>{index + 1}</td>
                    <td>{mov.TipoMovimiento}</td>
                    <td>{mov.Cantidad}</td>
                    <td>{new Date(mov.FechaMovimiento).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
};

export default TablaMovimientos;
