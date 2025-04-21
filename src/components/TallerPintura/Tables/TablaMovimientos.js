import React, { useEffect, useState } from "react";
import { Table, Button,DropdownItem,DropdownToggle,DropdownMenu,UncontrolledDropdown, Container, Card } from "reactstrap";
import ModalAgregarMovimiento from "./ModalAgregarMovimiento";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaMovimientos = (onEditarClick,onVerClick) => {
  const [movimientos, setMovimientos] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerMovimientos = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/movimientos");
      const data = await res.json();
      const movimientosArray = Array.isArray(data) ? data : [data];
      setMovimientos(movimientosArray);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      setMovimientos([]);
    }
  };

  const agregarMovimiento = async (nuevoMovimiento) => {
    await fetch("http://localhost:8000/pintura/POST/movimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMovimiento),
    });
    obtenerMovimientos();
    toggleModal();
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  return (
    <>
    <HeaderTallerPintura/>
    <Container className="mt--7" fluid>
      <Button color="info" onClick={toggleModal}>
        Agregar Movimiento
      </Button>
      <Card className="shadow p-4 mb-4">
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>#</th>
            <th>Tipo Movimiento</th>
            <th>Cantidad</th>
            <th>Fecha Movimiento</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hay movimientos registrados
              </td>
            </tr>
          ) : (
          movimientos.map((mov, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{mov.TipoMovimiento}</td>
              <td>{mov.Cantidad}</td>
              <td>{mov.FechaMovimiento}</td>
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
      <ModalAgregarMovimiento
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarMovimiento}
      />
      </Card>
      </Container>
    </>
  );
};

export default TablaMovimientos;
