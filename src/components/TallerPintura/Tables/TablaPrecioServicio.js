import React, { useEffect, useState } from "react";
import { Table, Button,DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown, Container, Card } from "reactstrap";
import ModalAgregarPrecioServicio from "../Modals/ModalAgregarPrecioServicio";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaPrecioServicio = (onEditarClick,onVerClick) => {
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
        Authorization: token
      },
      body: JSON.stringify({
        metadata: {
          uri: "/pintura/GET/precioservicio"
        },
        request: {}
      })
    });

    if (!res.ok) {
      console.error("Respuesta del servidor no fue OK:", res.status);
      setPrecios([]);
      return;
    }

    const data = await res.json();
    const preciosArray = Array.isArray(data.response?.data) ? data.response.data : [];

    setPrecios(preciosArray);

  } catch (error) {
    console.error("Error al obtener precios:", error);
    setPrecios([]);
  }
};

  const agregarPrecio = async (nuevoPrecio) => {
    await fetch("http://64.23.169.22:8000/pintura/POST/precioservicio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPrecio),
    });
    obtenerPrecios();
    toggleModal();
  };

  useEffect(() => {
    obtenerPrecios();
  }, []);

  return (
    <>
    <HeaderTallerPintura/>
    <br></br>
    <Container className="mt--7" fluid>
      <Button color="primary" onClick={toggleModal}>
        Agregar Precio Servicio
      </Button>
      <Card className="shadow p-4 mb-4">
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th>ID</th>
            <th>ID Tipo Servicio</th>
            <th>ID Tipo Vehículo</th>
            <th>Precio</th>
            <th>Fecha Creación</th>
            <th>Última Actualización</th>
          </tr>
        </thead>
        <tbody>
          {precios.length === 0 ? (
            <tr>
                <td colSpan="6" className="text-center">
                    No hay precios de servicio disponibles
                </td>
            </tr>
          ) : (
            precios.map((item, index) => (
            <tr key={index}>
              <td>{item.idPrecioServicioVehiculo}</td>
              <td>{item.idTipoServicio}</td>
              <td>{item.idTipoVehiculo}</td>
              <td>${item.Precio.toFixed(2)}</td>
              <td>{new Date(item.CreatedAt).toLocaleString()}</td>
              <td>{new Date(item.UpdatedAt).toLocaleString()}</td>
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
      <ModalAgregarPrecioServicio isOpen={modal} toggle={toggleModal} onSubmit={agregarPrecio}/>
      </Card>
      </Container>
    </>
  );
};

export default TablaPrecioServicio;
