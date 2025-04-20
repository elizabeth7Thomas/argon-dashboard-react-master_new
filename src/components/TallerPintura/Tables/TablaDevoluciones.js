import React, { useEffect, useState } from "react";
import { Table, Button, UncontrolledDropdown,DropdownItem,DropdownMenu,DropdownToggle } from "reactstrap";
import ModalAgregarDevolucion from "./ModalAgregarDevolucion";

const TablaDevoluciones = ({onEditarClick, onVerClick}) => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerDevoluciones = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/devolucion");
      const data = await res.json();
      const devolucionArray = Array.isArray(data) ? data : [data];
      setDevoluciones(devolucionArray);
    } catch (error) {
      console.error("Error al obtener devoluciones:", error);
      setDevoluciones([]);
    }
  };

  const agregarDevolucion = async (nuevaDevolucion) => {
    await fetch("http://localhost:8000/pintura/POST/devolucion", {
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
      <Button color="warning" onClick={toggleModal}>
        Registrar Devolución
      </Button>
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
      <ModalAgregarDevolucion
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarDevolucion}
      />
    </>
  );
};

export default TablaDevoluciones;
