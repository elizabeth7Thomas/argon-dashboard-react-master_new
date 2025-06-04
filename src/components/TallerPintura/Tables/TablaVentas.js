import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Container,
} from "reactstrap";
import ModalAgregarVenta from "../Modals/ModalAgregarVenta";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaVentas = ({ onEditarClick, onVerClick }) => {
  const [ventas, setVentas] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerVentas = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No se encontró un token de autenticación");
        setVentas([]);
        return;
      }

      // Función genérica para hacer peticiones al broker
      const fetchData = async (uri, request = {}) => {
        const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({
            metadata: { uri },
            request
          })
        });

        if (!res.ok) {
          throw new Error(`Error en ${uri}: ${res.status}`);
        }

        const data = await res.json();
        return Array.isArray(data.response?.data) ? data.response.data : [];
      };

      // 1. Obtener todas las ventas
      const ventasData = await fetchData("/pintura/GET/venta");

      // 2. Obtener detalles de cada venta usando el ID embebido en la URI
      const detallesData = await Promise.all(
        ventasData.map((venta) =>
          fetchData(`/pintura/GET/detalleventas/${venta.idVenta}`)
            .then((detalles) => ({ idVenta: venta.idVenta, detalles }))
        )
      );

      // 3. Obtener todas las devoluciones
      const devolucionesData = await fetchData("/pintura/GET/devolucion");

      // 4. Armar la estructura final con detalles y devoluciones
      const ventasCompletas = ventasData.map((venta) => {
        const detalleObj = detallesData.find((d) => d.idVenta === venta.idVenta);
        const detalles = detalleObj?.detalles || [];

        const detallesConDevoluciones = detalles.map((detalle) => {
          const devolucion = devolucionesData.find(
            (dev) => dev.idDetalleVenta === detalle.idDetalleVenta
          );
          return { ...detalle, devolucion };
        });

        return {
          ...venta,
          detalles: detallesConDevoluciones
        };
      });

      setVentas(ventasCompletas);

    } catch (error) {
      console.error("Error al obtener ventas completas:", error);
      setVentas([]);
    }
  };

  const agregarVenta = (nuevaVenta) => {
    // Lógica simulada (podrías hacer push al array temporal si gustas)
    toggleModal();
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <>
      <HeaderTallerPintura />
      <Container className="mt--7" fluid>
        <Button color="primary" onClick={toggleModal}>
          Agregar Venta
        </Button>
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>No. Venta</th>
                <th>Fecha Venta</th>
                <th>Total</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>ID Servicio</th>
                <th>ID Vehículo</th>
                <th>Devolución</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => (
                  <tr key={venta.idVenta}>
                    <td>{venta.idVenta}</td>
                    <td>{venta.FechaVenta}</td>
                    <td>${venta.TotalVenta.toFixed(2)}</td>
                    <td>{venta.detalle?.Cantidad || "-"}</td>
                    <td>${venta.detalle?.Subtotal?.toFixed(2) || "-"}</td>
                    <td>{venta.detalle?.idServicio || "-"}</td>
                    <td>{venta.detalle?.idTipoVehiculo || "-"}</td>
                    <td>
                      {venta.devolucion
                        ? `${venta.devolucion.Motivo} (${venta.devolucion.FechaDevolucion})`
                        : "Sin devolución"}
                    </td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className="btn-icon-only text-light"
                          size="sm"
                        >
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => onVerClick(venta)}>
                            Ver
                          </DropdownItem>
                          <DropdownItem onClick={() => onEditarClick(venta)}>
                            Editar
                          </DropdownItem>
                          <DropdownItem>Eliminar</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <ModalAgregarVenta
            isOpen={modal}
            toggle={toggleModal}
            onSubmit={agregarVenta}
          />
        </Card>
      </Container>
    </>
  );
};

export default TablaVentas;
