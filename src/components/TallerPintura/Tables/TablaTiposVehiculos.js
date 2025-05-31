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
import ModalAgregarTipoVehiculo from "../Modals/ModalAgregarTipoVehiculo";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaTiposVehiculos = () => {
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [modal, setModal] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditar, setTipoEditar] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setModoEdicion(false);
      setTipoEditar(null);
    }
  };
  const obtenerTipoVehiculos = async () => {
    try{
      const res = await fetch("http://127.0.0.1:8000/pintura/GET/tipovehiculos");
      if(!res.ok) throw new Error("Error al obtener el tipo de vehiculos");
      const data = await res.json();
      setTiposVehiculos(data);
    }catch(error){
      console.error("Error al cargar los datos", error.message);
    }
  };

  const agregarTipoVehiculo = (nuevoTipo) => {
    if (modoEdicion && tipoEditar) {
      // Editar tipo existente
      const tiposActualizados = tiposVehiculos.map((tipo) =>
        tipo.idTipoVehiculo === tipoEditar.idTipoVehiculo
          ? { ...tipo, NombreTipoVehiculo: nuevoTipo.NombreTipoVehiculo }
          : tipo
      );
      setTiposVehiculos(tiposActualizados);
    } else {
      // Agregar nuevo tipo
      const tipoConId = {
        ...nuevoTipo,
        idTipoVehiculo: nextId,
      };
      setTiposVehiculos((prev) => [...prev, tipoConId]);
      setNextId((prev) => prev + 1);
    }
    toggleModal();
  };

  const eliminarTipoVehiculo = (id) => {
    const nuevosTipos = tiposVehiculos.filter((tipo) => tipo.idTipoVehiculo !== id);
    setTiposVehiculos(nuevosTipos);
  };

  const iniciarEdicion = (tipo) => {
    setModoEdicion(true);
    setTipoEditar(tipo);
    setModal(true);
  };

  useEffect(() => {
    obtenerTipoVehiculos();
  }, []);

  return (
    <>
     <br></br><br></br>
      <Container className="mt--7" fluid>
      
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Tipo de Vehículo</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposVehiculos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                tiposVehiculos.map((tipo) => (
                  <tr key={tipo.idTipoVehiculo}>
                    <td>{tipo.idTipoVehiculo}</td>
                    <td>{tipo.NombreTipoVehiculo}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => alert(`Ver: ${tipo.NombreTipoVehiculo}`)}>
                            Ver
                          </DropdownItem>
                          <DropdownItem onClick={() => iniciarEdicion(tipo)}>
                            Editar
                          </DropdownItem>
                          <DropdownItem onClick={() => eliminarTipoVehiculo(tipo.idTipoVehiculo)}>
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
        </Card>
        <ModalAgregarTipoVehiculo
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={agregarTipoVehiculo}
          modoEdicion={modoEdicion}
          tipoEditar={tipoEditar}
        />
        <Button color="primary" onClick={toggleModal}>
          Agregar Tipo de Vehículo
        </Button>
      </Container>
        
    </>
  );
};

export default TablaTiposVehiculos;
