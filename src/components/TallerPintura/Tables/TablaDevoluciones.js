import React, { useEffect, useState } from "react";
import { Table,Container, Button, UncontrolledDropdown,DropdownItem,DropdownMenu,DropdownToggle, Card } from "reactstrap";
import ModalAgregarDevolucion from "../Modals/ModalAgregarDevolucion";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaDevoluciones = ({onEditarClick, onVerClick}) => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerDevoluciones = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró un token de autenticación");
      setDevoluciones([]);
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
          uri: "/pintura/GET/devolucion"
        },
        request: {}
      })
    });

    if (!res.ok) {
      console.error("Respuesta del servidor no fue OK:", res.status);
      setDevoluciones([]);
      return;
    }

    const data = await res.json();
    const devolucionArray = Array.isArray(data.response?.data) ? data.response.data : [];

    setDevoluciones(devolucionArray);

  } catch (error) {
    console.error("Error al obtener devoluciones:", error);
    setDevoluciones([]);
  }
};

  const agregarDevolucion = async (nuevaDevolucion) => {
    await fetch("http://64.23.169.22:8000/pintura/POST/devolucion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaDevolucion),
    });
    obtenerDevoluciones();
    toggleModal();
  };

  useEffect(() => {
    obtenerDevoluciones();
  }, []);

  return (
    <>
    <HeaderTallerPintura/>
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
          </tr>
        </thead>
        <tbody>
          {devoluciones.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay datos disponibles
              </td>
            </tr>
          ) :(
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
                            <DropdownItem onClick={() => onVerClick()}>Ver</DropdownItem>
                            <DropdownItem onClick={() => onEditarClick()}>Editar</DropdownItem>
                            <DropdownItem>Eliminar</DropdownItem>
                          </DropdownMenu>
                  </UncontrolledDropdown>                
              </td>
            </tr>
          ))
          )}
        </tbody>
      </Table>
      <ModalAgregarDevolucion isOpen={modal} toggle={toggleModal} onSubmit={agregarDevolucion}/>
      </Card>
      </Container>
    </>
  );
};

export default TablaDevoluciones;
