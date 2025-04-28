// TablaServicios.js
import React, { useEffect, useState } from "react";
import { Table, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Container, Card } from "reactstrap";
import ModalAgregarServicio from "../Modals/ModalAgregarServicio";
import HeaderTallerPintura from "components/Headers/HeaderTallerPintura";

const TablaServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [modal, setModal] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditar, setTipoEditar] = useState(null);

  const toggleModal = () => {setModal(!modal);
    if (modal) {
      setModoEdicion(false);
      setTipoEditar(null);
    }
  }

  const obtenerServicios = async () => {
    try {
      const res = await fetch("http://localhost:8000/pintura/GET/servicios");
      const data = await res.json();
      const serviciosArray = Array.isArray(data) ? data : [data];
      setServicios(serviciosArray);

      // Si hay servicios, establecer el próximo ID como el último + 1
      if (serviciosArray.length > 0) {
        const maxId = Math.max(...serviciosArray.map(s => s.idServicio));
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      setServicios([]);
    }
  };

  const agregarServicio = (nuevoServicio) => {
    if (modoEdicion && tipoEditar) {
      // Editar servicio existente
      const serviciosActualizados = servicios.map((servicio) =>
        servicio.idServicio === tipoEditar.idServicio
          ? { ...servicio, NombreServicio: nuevoServicio.NombreServicio, DescripcionServicio: nuevoServicio.DescripcionServicio }
          : servicio
      );
      setServicios(serviciosActualizados);
    } else {
      // Agregar nuevo servicio
      const servicioConId = {
        ...nuevoServicio,
        idServicio: nextId,
      };
      setServicios((prev) => [...prev, servicioConId]);
      setNextId((prev) => prev + 1);
    }
    toggleModal();  
  };

  const eliminarServicio = (id) => {
    const confirmacion = window.confirm("Estás seguro de eliminar este dato?");
    if (confirmacion){const nuevosServicios = servicios.filter((servicio) => servicio.idServicio !== id);
    setServicios(nuevosServicios);}
  };

  const iniciarEdicion = (servicio) => {
    setModoEdicion(true);
    setTipoEditar(servicio);
    setModal(true);
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  return (
    <>
      <HeaderTallerPintura />
      <Container className="mt--7" fluid>
        <Button color="primary" onClick={toggleModal}>Agregar Servicio</Button>
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
                  <td colSpan="3" className="text-center">No hay servicios disponibles</td>
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
          <ModalAgregarServicio isOpen={modal} toggle={toggleModal} onSubmit={agregarServicio} />
        </Card>
      </Container>
    </>
  );
};

export default TablaServicios;
