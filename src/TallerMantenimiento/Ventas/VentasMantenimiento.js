import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";

const BROKER_URL = "http://64.23.169.22:3761/broker/api/rest";

const VentasMantenimiento = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaActual, setVentaActual] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  useEffect(() => {
    obtenerVentas();
  }, []);

  const brokerRequest = async (uri, method, body = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token de autenticación no disponible.");
      return;
    }

    try {
      const res = await axios.post(
        BROKER_URL,
        { uri, method, body },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.response;
      if (data._broker_status !== 200 && data._broker_status !== 201) {
        throw new Error(data._broker_message || "Error desconocido del broker.");
      }

      return data.data;
    } catch (error) {
      const brokerMsg =
        error.response?.data?.response?._broker_message || error.message;
      throw new Error(`Error del broker: ${brokerMsg}`);
    }
  };

  const obtenerVentas = async () => {
    try {
      const data = await brokerRequest("/ventas/obtener", "POST", {});
      setVentas(data || []);
    } catch (error) {
      console.error("Error al obtener ventas:", error.message);
      alert(error.message);
    }
  };

  const abrirModal = (venta = null) => {
    setVentaActual(
      venta || {
        tipoventa: "",
        fechaventa: "",
        totalventa: "",
        idcliente: "",
        status: 1,
      }
    );
    setModoEditar(!!venta);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setVentaActual(null);
    setModoEditar(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVentaActual({ ...ventaActual, [name]: value });
  };

  const guardarVenta = async () => {
    const { tipoventa, fechaventa, totalventa, idcliente } = ventaActual;

    // Validación básica de campos requeridos
    if (!tipoventa || !fechaventa || !totalventa || !idcliente) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (modoEditar) {
        await brokerRequest(
          `/ventas/actualizar/${ventaActual.id}`,
          "PUT",
          ventaActual
        );
      } else {
        await brokerRequest("/ventas/crear", "POST", ventaActual);
      }

      cerrarModal();
      obtenerVentas();
    } catch (error) {
      console.error("Error al guardar venta:", error.message);
      alert(error.message);
    }
  };

  const eliminarVenta = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta venta?")) return;

    try {
      await brokerRequest(`/ventas/eliminar/${id}`, "DELETE");
      obtenerVentas();
    } catch (error) {
      console.error("Error al eliminar venta:", error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <Button color="success" onClick={() => abrirModal()}>
        Nueva Venta
      </Button>
      <br />
      <br />
      <Table bordered responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo de Venta</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>{venta.tipoventa}</td>
              <td>{venta.fechaventa}</td>
              <td>{venta.totalventa}</td>
              <td>{venta.idcliente}</td>
              <td>{venta.status === 1 ? "Activo" : "Inactivo"}</td>
              <td>
                <Button
                  color="warning"
                  size="sm"
                  onClick={() => abrirModal(venta)}
                >
                  Editar
                </Button>{" "}
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => eliminarVenta(venta.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={cerrarModal}>
        <ModalHeader toggle={cerrarModal}>
          {modoEditar ? "Editar Venta" : "Nueva Venta"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Tipo de Venta</Label>
            <Input
              name="tipoventa"
              value={ventaActual?.tipoventa || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Fecha</Label>
            <Input
              type="date"
              name="fechaventa"
              value={ventaActual?.fechaventa || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Total</Label>
            <Input
              type="number"
              step="0.01"
              name="totalventa"
              value={ventaActual?.totalventa || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>ID Cliente</Label>
            <Input
              type="number"
              name="idcliente"
              value={ventaActual?.idcliente || ""}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Estado</Label>
            <Input
              type="select"
              name="status"
              value={ventaActual?.status}
              onChange={handleChange}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={guardarVenta}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default VentasMantenimiento;
