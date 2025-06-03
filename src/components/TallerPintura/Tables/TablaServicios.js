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
  Card
} from "reactstrap";
import ModalAgregarServicio from "../Modals/ModalAgregarServicio";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaServicios = () => {
  const [servicios, setServicios] = useState([]);
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

  const obtenerServicios = async () => {
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
          metadata: { uri: "/pintura/GET/servicios" },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = response.data;

      if (data && data.response && data.response.data) {
        const serviciosArray = Array.isArray(data.response.data)
          ? data.response.data
          : [data.response.data];
        setServicios(serviciosArray);
      } else {
        setError("La respuesta del broker no tiene datos válidos");
      }
    } catch (err) {
      console.error("Error al obtener servicios:", err);
      setError("Error al conectar con el broker");
    } finally {
      setLoading(false);
    }
  };

  const agregarServicio = async (nuevoServicio) => {
    try {
      if (modoEdicion && tipoEditar) {
        // PUT futuro aquí
        console.warn("Modo edición aún no implementado con backend");
      } else {
        const res = await axios.post("http://localhost:8000/pintura/POST/servicios", nuevoServicio, {
          headers: { "Content-Type": "application/json" }
        });

        if (res.status === 200 || res.status === 201) {
          setServicios((prev) => [...prev, res.data]);
        } else {
          console.error("Error al agregar servicio:", res);
        }
      }
    } catch (error) {
      console.error("Error al conectar con backend:", error);
    }

    toggleModal();
  };

  const eliminarServicio = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este dato?");
    if (confirmacion) {
      const nuevosServicios = servicios.filter((servicio) => servicio.idServicio !== id);
      setServicios(nuevosServicios);
    }
  };

  const iniciarEdicion = (servicio) => {
    setModoEdicion(true);
    setTipoEditar(servicio);
    setModal(true);
  };

  useEffect(() => {
    obtenerServicios();
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
                <th>Nombre del Servicio</th>
                <th>Descripción</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No hay servicios disponibles</td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.idServicio}>
                    <td>{s.idServicio}</td>
                    <td>{s.NombreServicio}</td>
                    <td>{s.DescripcionServicio}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => iniciarEdicion(s)}>Editar</DropdownItem>
                          <DropdownItem onClick={() => eliminarServicio(s.idServicio)}>Eliminar</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <ModalAgregarServicio
            isOpen={modal}
            toggle={toggleModal}
            onSubmit={agregarServicio}
            modoEdicion={modoEdicion}
            servicioEditar={tipoEditar}
          />
        </Card>
        <Button color="primary" onClick={toggleModal}>Agregar Servicio</Button>
      </Container>
    </>
  );
};

export default TablaServicios;
