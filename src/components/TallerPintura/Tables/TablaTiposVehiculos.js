import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Container,
  Spinner,
} from "reactstrap";
import ModalAgregarTipoVehiculo from "../Modals/ModalAgregarTipoVehiculo";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaTiposVehiculos = () => {
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditar, setTipoEditar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setModoEdicion(false);
      setTipoEditar(null);
    }
  };

  const obtenerTipoVehiculos = async () => {
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
          metadata: { uri: "/pintura/GET/tipovehiculos" },
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
        const tiposArray = Array.isArray(data.response.data)
          ? data.response.data
          : [data.response.data];
        setTiposVehiculos(tiposArray);
      } else {
        setError("La respuesta del broker no tiene datos válidos");
      }
    } catch (err) {
      console.error("Error al obtener tipos de vehículos:", err);
      setError("Error al conectar con el broker");
    } finally {
      setLoading(false);
    }
  };

  const agregarTipoVehiculo = (nuevoTipo) => {
    if (modoEdicion && tipoEditar) {
      // Editar tipo localmente por ahora
      const tiposActualizados = tiposVehiculos.map((tipo) =>
        tipo.idTipoVehiculo === tipoEditar.idTipoVehiculo
          ? { ...tipo, NombreTipoVehiculo: nuevoTipo.NombreTipoVehiculo }
          : tipo
      );
      setTiposVehiculos(tiposActualizados);
    } else {
      // Agregar localmente (sin persistencia aún)
      const idMax =
        tiposVehiculos.reduce((max, t) => (t.idTipoVehiculo > max ? t.idTipoVehiculo : max), 0) + 1;
      const tipoConId = {
        ...nuevoTipo,
        idTipoVehiculo: idMax,
      };
      setTiposVehiculos((prev) => [...prev, tipoConId]);
    }
    toggleModal();
  };

  const eliminarTipoVehiculo = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este dato?");
    if (confirmacion) {
      const nuevosTipos = tiposVehiculos.filter((tipo) => tipo.idTipoVehiculo !== id);
      setTiposVehiculos(nuevosTipos);
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
                          <DropdownItem onClick={() => alert(`Ver: ${tipo.NombreTipoVehiculo}`)}>
                            Ver
                          </DropdownItem>
                          <DropdownItem onClick={() => iniciarEdicion(tipo)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => eliminarTipoVehiculo(tipo.idTipoVehiculo)}>
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
        <ModalAgregarTipoVehiculo
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={agregarTipoVehiculo}
          modoEdicion={modoEdicion}
          tipoEditar={tipoEditar}
        />
        <Button color="primary" onClick={toggleModal}>
          Agregar Tipo de Vehículo
        </Button>
      </Container>
    </>
  );
};

export default TablaTiposVehiculos;
