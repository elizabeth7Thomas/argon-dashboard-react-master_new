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
            uri: "/pintura/GET/tipovehiculos",
          },
          request: {},
        }),
      });

      const data = await res.json();
      const tiposArray = Array.isArray(data.response?.data) ? data.response.data : [];
      setTiposVehiculos(tiposArray);
    } catch (error) {
      console.error("Error al cargar los datos", error.message);
    }
  };

  const actualizarTipoVehiculo = async (tipoActualizado) => {
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
            uri: `/pintura/PUT/tipovehiculos/${tipoActualizado.idTipoVehiculo}`,
          },
          request: {
            NombreTipoVehiculo: tipoActualizado.NombreTipoVehiculo,
          },
        }),
      });

      if (res.ok) {
        obtenerTipoVehiculos();
        toggleModal();
      } else {
        console.error("Error al actualizar tipo");
      }
    } catch (error) {
      console.error("Error en actualización:", error.message);
    }
  };

  const agregarTipoVehiculo = async (nuevoTipo) => {
    if (modoEdicion && tipoEditar) {
      const tipoConId = {
        ...nuevoTipo,
        idTipoVehiculo: tipoEditar.idTipoVehiculo,
      };
      await actualizarTipoVehiculo(tipoConId);
    } else {
      obtenerTipoVehiculos(); // El modal ya hace el POST
    }
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
      <Container className="mt-4" fluid>
        <Card className="shadow mb-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <h3 className="mb-0">Listado de Tipos de Vehículos</h3>
            <Button color="primary" onClick={toggleModal}>
              Agregar
            </Button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table className="table-bordered table-hover table-striped mb-0" responsive>
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
                            <DropdownItem onClick={() => iniciarEdicion(tipo)}>
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

        <ModalAgregarTipoVehiculo
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={agregarTipoVehiculo}
          modoEdicion={modoEdicion}
          tipoEditar={tipoEditar}
        />
      </Container>
    </>
  );
};

export default TablaTiposVehiculos;
