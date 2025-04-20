import React, { useEffect, useState } from "react";
import { Table, Button, DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown} from "reactstrap";
import ModalAgregarTipoServicio from "../Modals/ModalAgregarTipoServicio";

const TablaTiposServicios = (onEditarClick,onVerClick) => {
  const [tiposServicios, setTiposServicios] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerTiposServicios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/tiposervicios");
      const data = await res.json();
      const tiposServiciosArray = Array.isArray(data) ? data : [data];
      setTiposServicios(tiposServiciosArray);
    } catch (error){
      console.error("Error al obtener tipos de servicios:", error);
      setTiposServicios([]);
    }
  };

  const agregarTipoServicio = async (nuevo) => {
    await fetch("http://localhost:8000/pintura/POST/tiposervicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo)
    });
    obtenerTiposServicios(); // Actualiza la tabla
    toggleModal();
  };

  useEffect(() => {
    obtenerTiposServicios();
  }, []);

  return (
    <>
      <Button color="primary" onClick={toggleModal}>Agregar Tipo de Servicio</Button>
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
      <ModalAgregarTipoServicio isOpen={modal} toggle={toggleModal} onSubmit={agregarTipoServicio} />
    </>
  );
};

export default TablaTiposServicios;
