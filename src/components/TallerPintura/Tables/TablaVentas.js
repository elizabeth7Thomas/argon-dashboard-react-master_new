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

  const obtenerVentasSimuladas = () => {
    // Datos simulados
    const ventasData = [
      { idVenta: 1, FechaVenta: "2025-03-11", TotalVenta: 200.5 },
      { idVenta: 2, FechaVenta: "2025-03-12", TotalVenta: 320.75 },
    ];

    const detallesData = [
      {
        idDetalleVenta: 1,
        idVenta: 1,
        idTipoVehiculo: 1,
        idServicio: 2,
        Cantidad: 3,
        Subtotal: 150.0,
        Devolucion: 1,
      },
      {
        idDetalleVenta: 2,
        idVenta: 2,
        idTipoVehiculo: 2,
        idServicio: 1,
        Cantidad: 2,
        Subtotal: 280.0,
        Devolucion: 0,
      },
    ];

    const devolucionesData = [
      {
        FechaDevolucion: "2025-05-10",
        Motivo: "Desgaste",
        idDetalleVenta: 1,
      },
    ];

    // Unir la información de los tres endpoints simulados
    const ventasCompletas = ventasData.map((venta) => {
      const detalle = detallesData.find((d) => d.idVenta === venta.idVenta);
      const devolucion = devolucionesData.find(
        (dev) => dev.idDetalleVenta === detalle?.idDetalleVenta
      );

      return {
        ...venta,
        detalle,
        devolucion,
      };
    });

    setVentas(ventasCompletas);
  };

  const agregarVenta = (nuevaVenta) => {
    // Lógica simulada (podrías hacer push al array temporal si gustas)
    toggleModal();
  };

  useEffect(() => {
    obtenerVentasSimuladas();
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
