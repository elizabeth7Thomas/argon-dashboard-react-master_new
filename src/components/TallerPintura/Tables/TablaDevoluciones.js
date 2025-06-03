import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Button,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Card,
  Spinner,
} from "reactstrap";
import ModalAgregarDevolucion from "../Modals/ModalAgregarDevolucion";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaDevoluciones = ({ onEditarClick, onVerClick }) => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleModal = () => setModal(!modal);

  const obtenerDevoluciones = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token de autenticación no encontrado.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "/pintura/GET/devolucion" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data?.response?.data;
      const devolucionArray = Array.isArray(data) ? data : [data];
      setDevoluciones(devolucionArray);
    } catch (err) {
      console.error("Error al obtener devoluciones:", err);
      setError("Error al conectar con el broker.");
    } finally {
      setLoading(false);
    }
  };

  const agregarDevolucion = async (nuevaDevolucion) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No hay token disponible");
      return;
    }

    try {
      await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "/pintura/POST/devolucion" },
          request: nuevaDevolucion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      obtenerDevoluciones();
      toggleModal();
    } catch (err) {
      console.error("Error al registrar devolución:", err);
      alert("Error al registrar la devolución");
    }
  };

  useEffect(() => {
    obtenerDevoluciones();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <HeaderTallerPintura />
      <Container className="mt--7" fluid>
        <Button color="primary" onClick={toggleModal}>
          Registrar Devolución
        </Button>

        <Card className="shadow p-4 mb-4">
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha de Devolución</th>
                <th>Motivo</th>
                <th>ID Detalle Venta</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {devoluciones.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                devoluciones.map((dev, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{dev.FechaDevolucion}</td>
                    <td>{dev.Motivo}</td>
                    <td>{dev.idDetalleVenta}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => onVerClick(dev)}>Ver</DropdownItem>
                          <DropdownItem onClick={() => onEditarClick(dev)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => alert("Función eliminar pendiente")}>
                            Eliminar
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <ModalAgregarDevolucion
            isOpen={modal}
            toggle={toggleModal}
            onSubmit={agregarDevolucion}
          />
        </Card>
      </Container>
    </>
  );
};

export default TablaDevoluciones;
