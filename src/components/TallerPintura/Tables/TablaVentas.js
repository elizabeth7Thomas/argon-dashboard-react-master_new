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
import ModalVerDetalles from "../Modals/ModalVerDetalles";

const TablaVentas = ({ onEditarClick, onVerClick }) => {
  const [ventas, setVentas] = useState([]);
  const [modal, setModal] = useState(false);

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);

  const toggleModalDetalles = () => setModalDetallesOpen(!modalDetallesOpen);
  const toggleModal = () => setModal(!modal);

  const verDetallesVenta = (venta) => {
    setVentaSeleccionada(venta);
    setModalDetallesOpen(true);
  };

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
        const contenido = data.response?.data;

        if (Array.isArray(contenido)) return contenido;
        if (contenido?.clientes) return contenido.clientes;

        return [];
      };

      // 1. Obtener todas las ventas
      const ventasData = await fetchData("/pintura/GET/venta");

      // 2. Obtener detalles de cada venta
      const detallesData = await Promise.all(
        ventasData.map((venta) =>
          fetchData(`/pintura/GET/detalleventas/${venta.idVenta}`).then((detalles) => ({
            idVenta: venta.idVenta,
            detalles,
          }))
        )
      );

      // 3. Obtener todas las devoluciones
      const devolucionesData = await fetchData("/pintura/GET/devolucion");

      // 4. Obtener todos los clientes
      const clientesData = await fetchData("/pagos/cliente/obtener");

      // 5. Relacionar ventas con detalles, devoluciones y cliente
      const ventasCompletas = ventasData.map((venta) => {
        const detalleObj = detallesData.find((d) => d.idVenta === venta.idVenta);
        const detalles = detalleObj?.detalles || [];

        const detallesConDevoluciones = detalles.map((detalle) => {
          const devolucion = devolucionesData.find(
            (dev) => dev.idDetalleVenta === detalle.idDetalleVenta
          );
          return { ...detalle, devolucion };
        });

        const cliente = clientesData.find(c => c._id === venta.idCliente);

        return {
          ...venta,
          detalles: detallesConDevoluciones,
          cliente
        };
      });

      setVentas(ventasCompletas);

    } catch (error) {
      console.error("Error al obtener ventas completas:", error);
      setVentas([]);
    }
  };

  const agregarVenta = (nuevaVenta) => {
    toggleModal();
  };
  
  useEffect(() => {
    if (!modal) {
      obtenerVentas();
    }
  }, [modal]);

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
<>
  <Container className="mt-4" fluid>
    <Card className="shadow mb-3 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <h3 className="mb-0">Listado de Ventas</h3>
        <Button color="primary" onClick={toggleModal}>
          Agregar Venta
        </Button>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table className="table-bordered table-hover table-striped mb-0" responsive>
          <thead className="thead-light">
            <tr>
              <th>No. Venta</th>
              <th>Fecha Venta</th>
              <th>Total</th>
              <th>Cliente</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              ventas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td>{venta.idVenta}</td>
                  <td>{new Date(venta.FechaVenta).toLocaleString()}</td>
                  <td>${venta.TotalVenta.toFixed(2)}</td>
                  <td>
                    {venta.cliente
                      ? `${venta.cliente.nombreCliente} ${venta.cliente.apellidosCliente}`
                      : "Cliente no encontrado"}
                  </td>
                  <td className="text-right">
                    <UncontrolledDropdown>
                      <DropdownToggle className="btn-icon-only text-light" size="sm">
                        <i className="fas fa-ellipsis-v" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem onClick={() => verDetallesVenta(venta)}>
                          Ver Detalles
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>

    <ModalAgregarVenta
      isOpen={modal}
      toggle={toggleModal}
      onSubmit={agregarVenta}
    />
    <ModalVerDetalles
      isOpen={modalDetallesOpen}
      toggle={toggleModalDetalles}
      venta={ventaSeleccionada}
    />
  </Container>
</>

  );
};

export default TablaVentas;
