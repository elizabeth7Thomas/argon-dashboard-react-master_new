import React, { useEffect, useState } from "react";
import { Table, Button,DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown } from "reactstrap";
import ModalAgregarTipoPintura from "../Modals/ModalAgregarTipoPintura";

const TablaTipoPinturas = (onEditarClick,onVerClick) => {
  const [tiposPintura, setTiposPintura] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerTiposPintura = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/tipospinturas");
      const data = await res.json();
      const tiposPinturaArray = Array.isArray(data) ? data : [data];
      setTiposPintura(tiposPinturaArray);
    } catch (error) {
      console.error("Error al obtener tipos de pintura:", error);
      setTiposPintura([]);
    }
  };

  const agregarTipoPintura = async (nuevoTipo) => {
    await fetch("http://localhost:8000/pintura/POST/tipopinturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTipo),
    });
    obtenerTiposPintura();
    toggleModal();
  };

  useEffect(() => {
    obtenerTiposPintura();
  }, []);

  return (
    <>
      <Button color="primary" onClick={toggleModal}>
        Agregar Tipo de Pintura
      </Button>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Nombre del Tipo de Pintura</th>
          </tr>
        </thead>
        <tbody>
          {tiposPintura.length === 0 ? (
            <tr>
                <td colSpan="2" className="text-center">
                    No hay tipos de pintura disponibles.
                </td>
            </tr>
          ) : (
            tiposPintura.map((tipo) => (
            <tr key={tipo.idTipoPintura}>
              <td>{tipo.idTipoPintura}</td>
              <td>{tipo.NombreTipoPintura}</td>
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
      <ModalAgregarTipoPintura
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarTipoPintura}
      />
    </>
  );
};

export default TablaTipoPinturas;
