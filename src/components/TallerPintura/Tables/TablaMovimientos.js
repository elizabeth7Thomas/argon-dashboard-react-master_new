import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Container,
} from "reactstrap";
import ModalAgregarMovimiento from "components/TallerPintura/Modals/ModalAgregarMovimiento";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaMovimientos = ({ onEditarClick = () => {}, onVerClick = () => {} }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerMovimientos = async () => {
    try {
      const res = await fetch("http://64.23.169.22:8000/pintura/GET/movimientos");
      const data = await res.json();
      const movimientosArray = Array.isArray(data) ? data : [data];
      setMovimientos(movimientosArray);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      setMovimientos([]);
    }
  };

  const agregarMovimiento = async (nuevoMovimiento) => {
    await fetch("http://64.23.169.22:8000/pintura/POST/movimientos", {
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
      <Container className="mt-4" fluid>
        <Card className="shadow mb-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <h3 className="mb-0">Listado de Movimientos</h3>
            <Button color="primary" onClick={toggleModal}>
              Agregar
            </Button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table className="table-bordered table-hover table-striped mb-0" responsive>
              <thead className="thead-light">
                <tr>
                  <th>#</th>
                  <th>Tipo Movimiento</th>
                  <th>Cantidad</th>
                  <th>Fecha Movimiento</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
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
                            <DropdownItem onClick={() => onVerClick(mov)}>Ver</DropdownItem>
                            <DropdownItem onClick={() => onEditarClick(mov)}>Editar</DropdownItem>
                            <DropdownItem disabled title="Eliminar no implementado">
                              Eliminar (deshabilitado)
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

        <ModalAgregarMovimiento
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={agregarMovimiento}
        />
      </Container>
    </>
  );
};

export default TablaMovimientos;
