import React, { useState } from "react";
import { Table, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Container, Card } from "reactstrap";
import ModalAgregarTipoServicio from "../Modals/ModalAgregarTipoServicio";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaTiposServicios = () => {
  const [tiposServicios, setTiposServicios] = useState([]);
  const [modal, setModal] = useState(false);
  const [editarTipo, setEditarTipo] = useState(null); // Para editar un tipo específico

  const toggleModal = () => setModal(!modal);

  const agregarTipoServicio = (nuevo) => {
    const ultimoID = tiposServicios.length ? Math.max(...tiposServicios.map((tipo) => tipo.idTipoServicio)) : 0;
    const nuevoID = ultimoID + 1; // ID correlativo
    const tipoServicioConID = { ...nuevo, idTipoServicio: nuevoID };

    setTiposServicios((prevState) => [...prevState, tipoServicioConID]);
    toggleModal();
  };

  const editarTipoServicio = (actualizado) => {
    const updatedServicios = tiposServicios.map((tipo) =>
      tipo.idTipoServicio === actualizado.idTipoServicio ? actualizado : tipo
    );
    setTiposServicios(updatedServicios);
    setEditarTipo(null); // Resetear el estado de edición
  };

  const eliminarTipoServicio = (id) => {
    setTiposServicios((prevState) => prevState.filter((tipo) => tipo.idTipoServicio !== id));
  };

  return (
    <>
      <HeaderTallerPintura />
      <Container className="mt--7" fluid>
        <Button color="primary" onClick={toggleModal}>
          Agregar Tipo de Servicio
        </Button>
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Tipo</th>
                <th>Precio Base</th>
                <th>ID Servicio</th>
              </tr>
            </thead>
            <tbody>
              {tiposServicios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay tipos de servicio disponibles
                  </td>
                </tr>
              ) : (
                tiposServicios.map((tipo) => (
                  <tr key={tipo.idTipoServicio}>
                    <td>{tipo.idTipoServicio}</td>
                    <td>{tipo.NombreTipo}</td>
                    <td>${tipo.PrecioBase}</td>
                    <td>{tipo.idServicio}</td>
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => setEditarTipo(tipo)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => eliminarTipoServicio(tipo.idTipoServicio)}>Eliminar</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <ModalAgregarTipoServicio
            isOpen={modal || editarTipo !== null}
            toggle={toggleModal}
            tipoServicio={editarTipo}
            onSubmit={editarTipo ? editarTipoServicio : agregarTipoServicio}
          />
        </Card>
      </Container>
    </>
  );
};

export default TablaTiposServicios;
