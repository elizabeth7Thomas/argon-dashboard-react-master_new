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
import ModalAgregarInventarioVehiculo from "../Modals/ModalAgregarInventarioVehiculo";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaInventarioVehiculos = () => {
  const [vehiculosInventario, setVehiculosInventario] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setModoEdicion(false);
      setVehiculoEditar(null);
    }
  };

  const obtenerInventarioVehiculos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/vehiculoinventarios",
          },
          request: {},
        }),
      });

      if (!res.ok) throw new Error("Error al obtener datos");

      const data = await res.json();
      const vehiculoInventarioArray = Array.isArray(data.response?.data) ? data.response.data : [];
      setVehiculosInventario(vehiculoInventarioArray);
    } catch (error) {
      console.error("Error:", error.message);
      setVehiculosInventario([]);
    }
  };

  const iniciarEdicion = (item) => {
    setModoEdicion(true);
    setVehiculoEditar(item);
    setModal(true);
  };

  const handleSubmit = () => {
    obtenerInventarioVehiculos();
    toggleModal();
  };

  useEffect(() => {
    obtenerInventarioVehiculos();
  }, []);

  return (
    <>
      <Container className="mt-4" fluid>
        <Card className="shadow mb-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <h3 className="mb-0">Inventario por Tipo de Vehículo</h3>
            <Button color="primary" onClick={toggleModal}>
              Agregar Inventario de Vehículo
            </Button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table className="table-bordered table-hover table-striped mb-0" responsive>
              <thead className="thead-light">
                <tr>
                  <th>#</th>
                  <th>ID Tipo Vehículo</th>
                  <th>ID Inventario</th>
                  <th>Cantidad Requerida</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosInventario.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay datos disponibles
                    </td>
                  </tr>
                ) : (
                  vehiculosInventario.map((item) => (
                    <tr key={item.idVehiculoInventario}>
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
                            <DropdownItem onClick={() => iniciarEdicion(item)}>
                              Editar
                            </DropdownItem>
                            <DropdownItem disabled title="No disponible en backend">
                              Eliminar (deshabilitado)
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        <ModalAgregarInventarioVehiculo
          isOpen={modal}
          toggle={toggleModal}
          modoEdicion={modoEdicion}
          vehiculoEditar={vehiculoEditar}
          onSubmit={handleSubmit}
        />
      </Container>
    </>
  );
};

export default TablaInventarioVehiculos;
