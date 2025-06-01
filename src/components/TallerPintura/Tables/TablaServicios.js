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
    const token = localStorage.getItem("token"); // Asegúrate que esté guardado así

    const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}` // Token incluido aquí
      },
      body: JSON.stringify({
        metadata: {
          uri: "/pintura/GET/servicios" // URI de tu servicio
        },
        request: null
      })
    });

    if (!res.ok) {
      console.error("Respuesta del servidor no fue OK:", res.status);
      setServicios([]);
      return;
    }

    const data = await res.json();

    // Validar que la respuesta sea un arreglo
    const serviciosArray = Array.isArray(data) ? data : [data];

    setServicios(serviciosArray);

    // Establecer el próximo ID
    if (serviciosArray.length > 0) {
      const maxId = Math.max(...serviciosArray.map(s => s.idServicio || 0));
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }

  } catch (error) {
    console.error("Error al obtener servicios:", error);
    setServicios([]);
  }
};



const agregarServicio = async (nuevoServicio) => {
  try {
    if (modoEdicion && tipoEditar) {
      // Aquí se haría PUT (editar) en el futuro
      console.warn("Modo edición aún no implementado con backend");
    } else {
      const res = await fetch("http://localhost:8000/pintura/POST/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoServicio)
      });

      if (res.ok) {
        const servicioCreado = await res.json();
        setServicios((prev) => [...prev, servicioCreado]);
        setNextId((prev) => prev + 1);
      } else {
        console.error("Error al agregar servicio:", await res.text());
      }
    }
  } catch (error) {
    console.error("Error al conectar con backend:", error);
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
     
      <br></br><br></br>
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
        <Button color="primary" onClick={toggleModal}>Agregar Servicio</Button>
      </Container>
    </>
  );
};

export default TablaServicios;
