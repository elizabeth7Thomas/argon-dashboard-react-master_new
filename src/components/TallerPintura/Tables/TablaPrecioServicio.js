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
import ModalAgregarPrecioServicio from "../Modals/ModalAgregarPrecioServicio";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaPrecioServicio = ({ onEditarClick, onVerClick }) => {
  const [precios, setPrecios] = useState([]);
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const obtenerPrecios = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No se encontró un token de autenticación");
        setPrecios([]);
        return;
      }

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/precioservicio",
          },
          request: {},
        }),
      });

      if (!res.ok) {
        console.error("Respuesta del servidor no fue OK:", res.status);
        setPrecios([]);
        return;
      }

      const data = await res.json();
      const preciosArray = Array.isArray(data.response?.data)
        ? data.response.data
        : [];

      setPrecios(preciosArray);
    } catch (error) {
      console.error("Error al obtener precios:", error);
      setPrecios([]);
    }
  };

  const agregarPrecio = async (nuevoPrecio) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    const body = {
      metadata: {
        uri: "/pintura/POST/precioservicio",
      },
      request: nuevoPrecio,
    };

    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Error al agregar precio:", res.status, await res.text());
        return;
      }

      obtenerPrecios();
      toggleModal();
    } catch (err) {
      console.error("Fallo en la solicitud agregarPrecio:", err);
    }
  };

  useEffect(() => {
    obtenerPrecios();
  }, []);

  return (
    <>
      <Container className="mt-4" fluid>
        <Card className="shadow mb-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <h3 className="mb-0">Listado de Precios por Servicio</h3>
            <Button color="primary" onClick={toggleModal}>
              Agregar Precio Servicio
            </Button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table className="table-bordered table-hover table-striped mb-0" responsive>
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>ID Tipo Servicio</th>
                  <th>ID Tipo Vehículo</th>
                  <th>Precio</th>
                  <th>Fecha Creación</th>
                  <th>Última Actualización</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {precios.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay precios de servicio disponibles
                    </td>
                  </tr>
                ) : (
                  precios.map((item, index) => (
                    <tr key={index}>
                      <td>{item.idPrecioServicioVehiculo}</td>
                      <td>{item.idTipoServicio}</td>
                      <td>{item.idTipoVehiculo}</td>
                      <td>Q{item.Precio.toFixed(2)}</td>
                      <td>{new Date(item.CreatedAt).toLocaleString()}</td>
                      <td>{new Date(item.UpdatedAt).toLocaleString()}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle className="btn-icon-only text-light" size="sm">
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem onClick={() => onVerClick(item)}>Ver</DropdownItem>
                            <DropdownItem onClick={() => onEditarClick(item)}>Editar</DropdownItem>
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

        <ModalAgregarPrecioServicio
          isOpen={modal}
          toggle={toggleModal}
          onSubmit={agregarPrecio}
        />
      </Container>
    </>
  );
};

export default TablaPrecioServicio;
