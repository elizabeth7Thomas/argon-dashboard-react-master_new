import React, { useState, useEffect } from "react";
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
import ModalAgregarTipoServicio from "../Modals/ModalAgregarTipoServicio";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaTiposServicios = () => {
  const [tiposServicios, setTiposServicios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [modal, setModal] = useState(false);
  const [editarTipo, setEditarTipo] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
    setEditarTipo(null);
  };

  const token = localStorage.getItem("token");

  const obtenerTiposServicios = async () => {
    try {
      if (!token) return console.error("No se encontró un token de autenticación");

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/tiposervicios",
          },
          request: {},
        }),
      });

      const data = await res.json();
      const tiposArray = Array.isArray(data.response?.data) ? data.response.data : [];
      setTiposServicios(tiposArray);
    } catch (error) {
      console.error("Error cargando tipos de servicios:", error.message);
    }
  };

  const obtenerServicios = async () => {
    try {
      if (!token) return;

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/servicios",
          },
          request: {},
        }),
      });

      const data = await res.json();
      const serviciosArray = Array.isArray(data.response?.data) ? data.response.data : [];
      setServicios(serviciosArray);
    } catch (error) {
      console.error("Error al obtener servicios:", error.message);
    }
  };

  useEffect(() => {
    obtenerTiposServicios();
    obtenerServicios();
  }, []);

  const handleSuccess = () => {
    obtenerTiposServicios();
    toggleModal();
  };

  const eliminarTipoServicio = async (id) => {
    try {
      const res = await fetch(`http://64.23.169.22:8000/pintura/DELETE/tiposervicios/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el tipo de servicio.");
      obtenerTiposServicios();
    } catch (error) {
      console.error("Error al eliminar:", error.message);
    }
  };

  const obtenerNombreServicio = (idServicio) => {
    const servicio = servicios.find((s) => s.idServicio === idServicio);
    return servicio ? servicio.NombreServicio : `ID ${idServicio}`;
  };

  return (
    <Container className="mt-4" fluid>
      <Card className="shadow mb-3 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <h3 className="mb-0">Listado de Tipos de Servicios</h3>
          <Button color="primary" onClick={toggleModal}>
            Agregar
          </Button>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table className="table-bordered table-hover table-striped mb-0" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Tipo</th>
                <th>Servicio</th>
                <th className="text-right">Acciones</th>
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
                    <td>{obtenerNombreServicio(tipo.idServicio)}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => setEditarTipo(tipo)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => eliminarTipoServicio(tipo.idTipoServicio)}>
                            Eliminar
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

      <ModalAgregarTipoServicio
        isOpen={modal || editarTipo !== null}
        toggle={toggleModal}
        tipoServicio={editarTipo}
        modoEdicion={editarTipo !== null}
        onSuccess={handleSuccess}
      />
    </Container>
  );
};

export default TablaTiposServicios;
