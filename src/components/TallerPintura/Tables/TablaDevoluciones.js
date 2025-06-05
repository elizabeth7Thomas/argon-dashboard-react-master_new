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
  <Container className="mt-4" fluid>
    <Card className="shadow mb-3 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <h3 className="mb-0">Listado de Devoluciones</h3>
        <Button color="primary" onClick={toggleModal}>
          Registrar Devolución
        </Button>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table className="table-bordered table-hover table-striped mb-0" responsive>
          <thead className="thead-light">
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
                <td colSpan="5" className="text-center">
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
                        <DropdownItem disabled title="No disponible en backend">Eliminar</DropdownItem>
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

    <ModalAgregarDevolucion
      isOpen={modal}
      toggle={toggleModal}
      onSubmit={agregarDevolucion}
    />
  </Container>
</>

  );
};

export default TablaDevoluciones;
