// TablaInventario.js
import React, { useEffect, useState } from "react";
import { Table, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Container, Card,} from "reactstrap";
import ModalAgregarInventario from "../Modals/ModalAgregarInventario";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaInventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [nextId, setNextId] = useState(1); // Para ID correlativo
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditar, setTipoEditar] = useState(null);

  const toggleModal = () => {setModal(!modal);
    if(modal) {
      setModoEdicion(false);
      setTipoEditar(null);
    }
  }

  const obtenerInventarios = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró un token de autenticación");
      setInventarios([]);
      return;
    }

    const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        metadata: {
          uri: "/pintura/GET/inventarios"
        },
        request: {}
      })
    });

    if (!res.ok) {
      console.error("Respuesta del servidor no fue OK:", res.status);
      setInventarios([]);
      return;
    }

    const data = await res.json();
    const inventariosArray = Array.isArray(data.response?.data)
    ? data.response.data.filter(i => !i.deleted) // <== SOLO los no eliminados
    : [];

    setInventarios(inventariosArray);

    if (inventariosArray.length > 0) {
      const maxId = Math.max(...inventariosArray.map(i => i.idInventario || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }

  } catch (error) {
    console.error("Error al obtener inventario:", error);
    setInventarios([]);
  }
};

  const agregarInventario = (nuevoInventario) => {
    if (modoEdicion && tipoEditar){
      const inventariosActualizados = inventarios.map((Inventario) =>
      Inventario.idInventario === tipoEditar.idInventario
        ? {...Inventario, NombreProducto: nuevoInventario.NombreProducto, CantidadDisponible: nuevoInventario.CantidadDisponible, idTipoPintura: nuevoInventario.idTipoPintura, TipoInventario: nuevoInventario.TipoInventario, Lote: nuevoInventario.Lote, CodigoColor: nuevoInventario.CodigoColor, FechaAdquisicion: nuevoInventario.FechaAdquisicion, FechaVencimiento: nuevoInventario.FechaVencimiento, EstadoInventario: nuevoInventario.EstadoInventario }
      : Inventario
    );
    setInventarios(inventariosActualizados);
    }else {
      const inventarioConId = {
        idInventario: nextId,
        ...nuevoInventario,
      };
      setInventarios((prev) => [...prev, inventarioConId]);
      setNextId((prev) => prev + 1);
    }
    toggleModal();
  };

  const eliminarInventario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (!confirmacion) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token de autenticación no encontrado.");
      return;
    }

    try {
      // Buscar el inventario actual para conservar sus valores
      const inventario = inventarios.find(inv => inv.idInventario === id);
      if (!inventario) {
        alert("Inventario no encontrado.");
        return;
      }

      const payload = {
        metadata: {
          uri: `/pintura/PUT/inventarios/${id}`
        },
        request: {
          ...inventario,
          deleted: true // Marcamos como eliminado
        }
      };

      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error al eliminar inventario:", error);
        alert("Error al eliminar inventario");
        return;
      }

      alert("Inventario eliminado correctamente");
      obtenerInventarios(); // Refresca la lista

    } catch (error) {
      console.error("Error de red al eliminar:", error);
      alert("Error de red: " + error.message);
    }
  };

  const iniciarEdicion = (Inventario) => {
    setModoEdicion(true);
    setTipoEditar(Inventario);
    setModal(true);
  };

  useEffect(() => {
    obtenerInventarios();
  }, []);

  return (
    <>
      <HeaderTallerPintura />
      <br></br><br></br>
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
                          <DropdownItem onClick={() => iniciarEdicion(inv)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => eliminarInventario(inv.idInventario)}>Eliminar</DropdownItem>
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
            onInventarioCreado={obtenerInventarios}
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
