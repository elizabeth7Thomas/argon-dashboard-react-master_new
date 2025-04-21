// TablaInventario.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Container,
  Card,
} from "reactstrap";
import ModalAgregarInventario from "../Modals/ModalAgregarInventario";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaInventario = ({ onEditarClick, onVerClick }) => {
  const [inventarios, setInventarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [nextId, setNextId] = useState(1); // Para ID correlativo

  const toggleModal = () => setModal(!modal);

  const obtenerInventarios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/inventario");
      const data = await res.json();
      const inventariosArray = Array.isArray(data) ? data : [data];
      setInventarios(inventariosArray);

      if (inventariosArray.length > 0) {
        const maxId = Math.max(...inventariosArray.map(i => i.idInventario));
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      setInventarios([]);
    }
  };

  const agregarInventario = (nuevoInventario) => {
    const inventarioConId = { ...nuevoInventario, idInventario: nextId };
    setInventarios(prev => [...prev, inventarioConId]);
    setNextId(prev => prev + 1);
    toggleModal();
  };

  useEffect(() => {
    obtenerInventarios();
  }, []);

  return (
    <>
      <HeaderTallerPintura />
      <Container className="mt--7" fluid>
        <Button color="primary" onClick={toggleModal}>
          Agregar Inventario
        </Button>
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Producto</th>
                <th>Cantidad Disponible</th>
                <th>ID Tipo Pintura</th>
                <th>Tipo Inventario</th>
                <th>Lote</th>
                <th>Código Color</th>
                <th>Fecha Adquisición</th>
                <th>Fecha Vencimiento</th>
                <th>Estado Inventario</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarios.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center">
                    No hay inventario disponible
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
                          <DropdownItem onClick={() => onVerClick(inv)}>Ver</DropdownItem>
                          <DropdownItem onClick={() => onEditarClick(inv)}>Editar</DropdownItem>
                          <DropdownItem>Eliminar</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
      <ModalAgregarInventario
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarInventario}
      />
    </>
  );
};

export default TablaInventario;
