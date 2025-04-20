import React, { useEffect, useState } from "react";
import { Table, Button, UncontrolledDropdown,DropdownMenu,DropdownItem,DropdownToggle} from "reactstrap";
import ModalAgregarVenta from "../Modals/ModalAgregarVenta";

const TablaVentas = ({onEditarClick, onVerClick}) => {
  const [ventas, setVentas] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerVentas = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/ventas");
      const data = await res.json();
      const ventasArray = Array.isArray(data) ? data : [data];
      setVentas(ventasArray);
    } catch (error){
      console.error("Error al obtener las ventas:", error);
      setVentas([]);
    }
  };

  const agregarVenta = async (nuevaVenta) => {
    await fetch("http://localhost:8000/pintura/POST/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaVenta),
    });
    obtenerVentas();
    toggleModal();
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <>
      <Button color="success" onClick={toggleModal}>
        Agregar Venta
      </Button>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>No. venta</th>
            <th>Cliente</th>
            <th>Fecha venta</th>
            <th>Total de la venta</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay ventas registradas
              </td>
            </tr>
          ) : (
          ventas.map((venta) => (
            <tr key={venta.idVenta}>
              <td>{venta.idVenta}</td>
              <td>{venta.idCliente}</td>
              <td>{venta.FechaVenta}</td>
              <td>${venta.TotalVenta.toFixed(2)}</td>
              <td className="text-right">
              <UncontrolledDropdown>
                  <DropdownToggle className="btn-icon-only text-light" size="sm">
                      <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem onClick={() => onVerClick(venta)}>Ver</DropdownItem>
                            <DropdownItem onClick={() => onEditarClick(venta)}>Editar</DropdownItem>
                            <DropdownItem>Eliminar</DropdownItem>
                          </DropdownMenu>
                  </UncontrolledDropdown>                
              </td>
            </tr>
          ))
          )}
        </tbody>
      </Table>
      <ModalAgregarVenta
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarVenta}
      />
    </>
  );
};

export default TablaVentas;
