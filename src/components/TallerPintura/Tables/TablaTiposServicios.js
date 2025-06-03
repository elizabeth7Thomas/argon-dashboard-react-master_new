import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Spinner,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const obtenerTiposServicios = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No se encontró un token de autenticación");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "/pintura/GET/tiposervicios" },
          request: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data && data.response && data.response.data) {
        const arrayTipos = Array.isArray(data.response.data)
          ? data.response.data
          : [data.response.data];
        setTiposServicios(arrayTipos);
      } else {
        setError("La respuesta del broker no contiene datos válidos");
      }
    } catch (err) {
      console.error("Error al obtener tipos de servicios:", err);
      setError("Error al conectar con el broker");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarEditar = async (nuevoTipo) => {
    try {
      if (modoEdicion && tipoEditar) {
        // Aquí iría lógica PUT
        console.warn("PUT aún no implementado");
      } else {
        const res = await axios.post("http://localhost:8000/pintura/POST/tiposervicios", nuevoTipo, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 200 || res.status === 201) {
          setTiposServicios((prev) => [...prev, res.data]);
        }
      }
    } catch (error) {
      console.error("Error al agregar o editar tipo de servicio:", error);
    }

    toggleModal();
  };

  const eliminarTipoServicio = async (id) => {
    const confirmacion = window.confirm("¿Deseas eliminar este tipo de servicio?");
    if (!confirmacion) return;

    try {
      await axios.delete(`http://localhost:8000/pintura/DELETE/tiposervicios/${id}`);
      setTiposServicios((prev) => prev.filter((tipo) => tipo.idTipoServicio !== id));
    } catch (error) {
      console.error("Error al eliminar tipo de servicio:", error);
    }
  };

  const iniciarEdicion = (tipo) => {
    setModoEdicion(true);
    setTipoEditar(tipo);
    setModal(true);
  };

  useEffect(() => {
    obtenerTiposServicios();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <Container className="mt--7" fluid>
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Tipo</th>
                <th>ID Servicio</th>
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
                    <td>{tipo.idServicio}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => iniciarEdicion(tipo)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => eliminarTipoServicio(tipo.idTipoServicio)}>Eliminar</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <ModalAgregarTipoServicio
            isOpen={modal}
            toggle={toggleModal}
            onSubmit={handleAgregarEditar}
            modoEdicion={modoEdicion}
            tipoEditar={tipoEditar}
          />
        </Card>

        <Button color="primary" onClick={toggleModal}>
          Agregar Tipo de Servicio
        </Button>
      </Container>
    </>
  );
};

export default TablaTiposServicios;
