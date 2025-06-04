import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Container,
  Card,
  Spinner,
} from "reactstrap";
import ModalAgregarInventario from "../Modals/ModalAgregarInventario";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaInventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditar, setTipoEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setModoEdicion(false);
      setTipoEditar(null);
    }
  };

  const token = localStorage.getItem("token");

  const obtenerInventarios = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "/pintura/GET/inventarios" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data?.response?.data || [];
      const inventariosArray = Array.isArray(data) ? data : [data];
      setInventarios(inventariosArray);
    } catch (err) {
      console.error("Error al obtener inventario:", err);
      setInventarios([]);
    } finally {
      setLoading(false);
    }
  };

  const agregarInventario = async (nuevoInventario) => {
    if (!token) {
      alert("Token no encontrado");
      return;
    }

    try {
      if (modoEdicion && tipoEditar) {
        await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "/pintura/PUT/inventario" },
            request: {
              idInventario: tipoEditar.idInventario,
              ...nuevoInventario,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "/pintura/POST/inventario" },
            request: nuevoInventario,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      obtenerInventarios();
      toggleModal();
    } catch (err) {
      console.error("Error al guardar inventario:", err);
      alert("Error al guardar el inventario");
    }
  };

  const eliminarInventario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (!confirmacion) return;

    try {
      await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "/pintura/DELETE/inventario" },
          request: { idInventario: id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      obtenerInventarios();
    } catch (err) {
      console.error("Error al eliminar inventario:", err);
      alert("No se pudo eliminar el inventario.");
    }
  };

  const iniciarEdicion = (inventario) => {
    setModoEdicion(true);
    setTipoEditar(inventario);
    setModal(true);
  };

  useEffect(() => {
    obtenerInventarios();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <HeaderTallerPintura />
      <br />
      <br />
      <Container className="mt--7" fluid>
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Producto</th>
                <th>Cantidad Disponible</th>
                <th>ID Tipo Pintura</th>
                <th>Tipo Inventario</th>
                <th>Lote</th>
                <th>Código Color</th>
                <th>Fecha Adquisición</th>
                <th>Fecha Vencimiento</th>
                <th>Estado Inventario</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarios.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center">
                    No hay inventario disponible
                  </td>
                </tr>
              ) : (
                inventarios.map((inv) => (
                  <tr key={inv.idInventario}>
                    <td>{inv.idInventario}</td>
                    <td>{inv.NombreProducto}</td>
                    <td>{inv.CantidadDisponible}</td>
                    <td>{inv.idTipoPintura}</td>
                    <td>{inv.TipoInventario}</td>
                    <td>{inv.Lote}</td>
                    <td>{inv.CodigoColor}</td>
                    <td>{inv.FechaAdquisicion}</td>
                    <td>{inv.FechaVencimiento}</td>
                    <td>{inv.EstadoInventario}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => iniciarEdicion(inv)}>
                            Editar
                          </DropdownItem>
                          <DropdownItem onClick={() => eliminarInventario(inv.idInventario)}>
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
          <ModalAgregarInventario
            isOpen={modal}
            toggle={toggleModal}
            onSubmit={agregarInventario}
            modoEdicion={modoEdicion}
            inventarioEditar={tipoEditar}
          />
        </Card>
        <Button color="primary" onClick={toggleModal}>
          Agregar Inventario
        </Button>
      </Container>
    </>
  );
};

export default TablaInventario;
