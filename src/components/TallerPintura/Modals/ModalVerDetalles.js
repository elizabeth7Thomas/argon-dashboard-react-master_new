import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
} from "reactstrap";

const ModalVerDetalles = ({ isOpen, toggle, venta }) => {
  const [servicios, setServicios] = useState([]);
  const [ventaLocal, setVentaLocal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            metadata: { uri: "/pintura/GET/servicios" },
            request: {},
          }),
        });
        const data = await res.json();
        const lista = data?.response?.data;
        setServicios(Array.isArray(lista) ? lista : []);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setServicios([]);
      }
    };

    if (isOpen && venta) {
      fetchServicios();
      setVentaLocal({ ...venta }); // Copia local de la venta para modificar devoluciones
    }
  }, [isOpen, venta]);

  const obtenerNombreServicio = (id) => {
    const serv = servicios.find((s) => s.idServicio === id);
    return serv ? serv.NombreServicio : `Servicio ${id}`;
  };

  const realizarDevolucion = async (detalle) => {
    if (detalle.devolucion) {
      alert("Este servicio ya fue devuelto.");
      return;
    }

    const motivo = prompt("Ingresa el motivo de la devolución:");
    if (!motivo?.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const fechaDevolucion = new Date().toISOString();

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: { uri: "/pintura/POST/devolucion" },
          request: {
            FechaDevolucion: fechaDevolucion,
            Motivo: motivo,
            idDetalleVenta: detalle.idDetalleVenta,
          },
        }),
      });

      const data = await res.json();

      if (data?.response?._broker_status === 200 && data?.response?.data) {
        const devolucion = data.response.data;
        alert("Devolución registrada exitosamente");

        // Actualizar copia local de venta
        const nuevaVenta = { ...ventaLocal };
        nuevaVenta.detalles = nuevaVenta.detalles.map((d) =>
          d.idDetalleVenta === detalle.idDetalleVenta
            ? { ...d, devolucion }
            : d
        );
        setVentaLocal(nuevaVenta);
      } else {
        console.error("Respuesta inesperada:", data);
        alert("Error al registrar devolución");
      }
    } catch (error) {
      console.error("Error en devolución:", error);
      alert("Error en devolución");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ventaLocal) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Detalles de la Venta #{ventaLocal.idVenta}
      </ModalHeader>
      <ModalBody>
        <p><strong>Fecha:</strong> {ventaLocal.FechaVenta}</p>
        <p><strong>Total:</strong> ${ventaLocal.TotalVenta.toFixed(2)}</p>

        <h5>Detalle de Servicios</h5>
        <Table bordered responsive>
          <thead className="thead-light">
            <tr>
              <th>Servicio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventaLocal.detalles?.map((detalle, index) => (
              <tr key={index}>
                <td>{obtenerNombreServicio(detalle.idServicio)}</td>
                <td>{detalle.Cantidad}</td>
                <td>${detalle.Subtotal?.toFixed(2)}</td>
                <td>
                  {detalle.devolucion
                    ? `${detalle.devolucion.Motivo} (${detalle.devolucion.FechaDevolucion})`
                    : "Sin devolución"}
                </td>
                <td>
                  {!detalle.devolucion && (
                    <Button
                      color="warning"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => realizarDevolucion(detalle)}
                    >
                      Devolver
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default ModalVerDetalles;
