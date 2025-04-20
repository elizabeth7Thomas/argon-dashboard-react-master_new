import React, { useEffect, useState } from "react";
import { Table, Button, DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown} from "reactstrap";
import ModalAgregarInventario from "../Modals/ModalAgregarInventario";

const TablaInventarios = (onVerClick, onEditarClick) => {
  const [inventarios, setInventarios] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerInventarios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/inventarios");
      const data = await res.json();
  
      const inventarioArray = Array.isArray(data) ? data : [data];
      setInventarios(inventarioArray);
    } catch (error) {
      console.error("Error al obtener inventarios:", error);
      setInventarios([]);
    }
  };

  const agregarInventario = async (nuevoInventario) => {
    await fetch("http://localhost:8000/pintura/POST/inventarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoInventario),
    });
    obtenerInventarios();
    toggleModal();
  };

  useEffect(() => {
    obtenerInventarios();
  }, []);

  return (
    <>
      <Button color="success" onClick={toggleModal}>
        Agregar Inventario
      </Button>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Tipo de Pintura</th>
            <th>Tipo Inventario</th>
            <th>Lote</th>
            <th>Código Color</th>
            <th>Adquisición</th>
            <th>Vencimiento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
          inventarios.map((inv) => (
            <tr key={inv.idInventario}>
              <td>{inv.idInventario}</td>
              <td>{inv.NombreProducto}</td>
              <td>{inv.CantidadDisponible}</td>
              <td>{inv.idTipoPintura}</td>
              <td>{inv.TipoInventario}</td>
              <td>{inv.Lote}</td>
              <td>{inv.CodigoColor}</td>
              <td>{inv.FechaAdquisicion}</td>
              <td>{inv.FechaVencimiento}</td>
              <td>{inv.EstadoInventario}</td>
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
      <ModalAgregarInventario
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarInventario}
      />
    </>
  );
};

export default TablaInventarios;
