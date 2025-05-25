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
  const [modal, setModal] = useState(false);
  const [editarTipo, setEditarTipo] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
    setEditarTipo(null); // Reiniciar edición si se cancela
  };

  const obtenerTiposServicios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/tiposervicios");
      if (!res.ok) throw new Error("Error al obtener los tipos de servicio.");
      const data = await res.json();
      setTiposServicios(data);
    } catch (error) {
      console.error("Error cargando tipos de servicios:", error.message);
    }
  };

  useEffect(() => {
    obtenerTiposServicios();
  }, []);

  const handleSuccess = () => {
    obtenerTiposServicios(); // Recargar la tabla después de agregar o editar
  };

  const eliminarTipoServicio = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/pintura/DELETE/tiposervicios/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el tipo de servicio.");
      obtenerTiposServicios(); // Refrescar tabla
    } catch (error) {
      console.error("Error al eliminar:", error.message);
    }
  };

  return (
    <>
      <HeaderTallerPintura />
      <br></br><br></br>
      <Container className="mt--7" fluid>
        
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Tipo</th>
                <th>ID Servicio</th>
                <th>Acciones</th>
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
                    <td>{tipo.idServicio}</td>
                    <td>
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
        </Card>
      </Container>
      <Button color="primary" onClick={toggleModal}>
          Agregar Tipo de Servicio
        </Button>

      <ModalAgregarTipoServicio
        isOpen={modal || editarTipo !== null}
        toggle={toggleModal}
        tipoServicio={editarTipo}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default TablaTiposServicios;
