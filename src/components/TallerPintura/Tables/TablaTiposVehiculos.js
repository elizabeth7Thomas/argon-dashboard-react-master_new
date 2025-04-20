import React, { useEffect, useState } from "react";
import { Table, Button, DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown } from "reactstrap";
import ModalAgregarTipoVehiculo from "../Modals/ModalAgregarTipoVehiculo";

const TablaTiposVehiculos = ({onVerClick,onEditarClick}) => {
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerTiposVehiculos = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/tiposvehiculos");
      const data = await res.json();
      const tiposVehiculosArray = Array.isArray(data) ? data : [data];
      setTiposVehiculos(tiposVehiculosArray);
    } catch (error){
      console.error("Error al obtener tipos de vehículos:", error);
      setTiposVehiculos([]);
    }
  };

  const agregarTipoVehiculo = async (nuevoTipo) => {
    await fetch("http://localhost:8000/pintura/POST/tipovehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTipo),
    });
    obtenerTiposVehiculos();
    toggleModal();
  };

  useEffect(() => {
    obtenerTiposVehiculos();
  }, []);

  return (
    <>
      <Button color="primary" onClick={toggleModal}>
        Agregar Tipo de Vehículo
      </Button>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Tipo de Vehículo</th>
          </tr>
        </thead>
        <tbody>
          {tiposVehiculos.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No hay datos disponibles
              </td>
            </tr>
          ):(
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
      <ModalAgregarTipoVehiculo
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarTipoVehiculo}
      />
    </>
  );
};

export default TablaTiposVehiculos;
