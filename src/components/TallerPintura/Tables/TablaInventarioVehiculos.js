import React, { useEffect, useState } from "react";
import { Table, Button, UncontrolledDropdown,DropdownItem,DropdownMenu,DropdownToggle, Container, Card} from "reactstrap";
import ModalAgregarInventarioVehiculo from "../Modals/ModalAgregarInventarioVehiculo";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaInventarioVehiculos = (onVerClick,onEditarClick) => {
  const [vehiculosInventario, setVehiculosInventario] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerInventarioVehiculos = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/vehiculoinventarios");
      const data = await res.json();
      const vehiculoInventarioArray = Array.isArray(data) ? data : [data];
      setVehiculosInventario(vehiculoInventarioArray);
    } catch (error) {
      console.error("Error al obtener inventarios de vehículos:", error);
      setVehiculosInventario([]);
    }
    
  };

  const agregarInventarioVehiculo = async (nuevoItem) => {
    await fetch("http://localhost:8000/pintura/POST/vehiculoinventarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoItem),
    });
    obtenerInventarioVehiculos();
    toggleModal();
  };

  useEffect(() => {
    obtenerInventarioVehiculos();
  }, []);

  return (
    <>
    <HeaderTallerPintura/>
    <Container className="mt--7" fluid>
      <Button color="primary" onClick={toggleModal}>
        Agregar Inventario de Vehículo
      </Button>
      <Card className="shadow p-4 mb-4">
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>#</th>
            <th>ID Tipo Vehículo</th>
            <th>ID Inventario</th>
            <th>Cantidad Requerida</th>
          </tr>
        </thead>
        <tbody>
          {vehiculosInventario.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay datos disponibles
              </td>
            </tr>
          ) : (
          vehiculosInventario.map((item, index) => (
            <tr key={index}>
              <td>{item.idVehiculoInventario}</td>
              <td>{item.idTipoVehiculo}</td>
              <td>{item.idInventario}</td>
              <td>{item.CantidadRequerida}</td>
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
      <ModalAgregarInventarioVehiculo isOpen={modal} toggle={toggleModal} onSubmit={agregarInventarioVehiculo}/>
      </Card>
      </Container>
    </>
  );
};

export default TablaInventarioVehiculos;
