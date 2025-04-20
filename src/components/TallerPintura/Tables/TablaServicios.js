import React, { useEffect, useState } from "react";
import { Table, Button,DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown } from "reactstrap";
import ModalAgregarServicio from "../Modals/ModalAgregarServicio";

const TablaServicios = (onEditarClick,onVerClick) => {
  const [servicios, setServicios] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerServicios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/servicios");
      const data = await res.json();
      const serviciosArray = Array.isArray(data) ? data : [data];
      setServicios(serviciosArray);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      setServicios([]);
    }
  };

  const agregarServicio = async (nuevo) => {
    await fetch("http://localhost:8000/pintura/POST/servicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo)
    });
    obtenerServicios(); // Refrescar lista
    toggleModal();
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  return (
    <>
      <Button color="primary" onClick={toggleModal}>Agregar Servicio</Button>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Nombre del Servicio</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No hay servicios disponibles</td>
            </tr>
          ) : (
          servicios.map((s) => (
            <tr key={s.idServicio}>
              <td>{s.idServicio}</td>
              <td>{s.NombreServicio}</td>
              <td>{s.DescripcionServicio}</td>
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
      <ModalAgregarServicio isOpen={modal} toggle={toggleModal} onSubmit={agregarServicio} />
    </>
  );
};

export default TablaServicios;