// TablaServicios.js
import React, { useEffect, useState } from "react";
import { Table, Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Container, Card } from "reactstrap";
import ModalAgregarServicio from "../Modals/ModalAgregarServicio";

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
        //"Access-Control-Allow-Origin": "*",
        Authorization: token // Token incluido aquí
      },
      body: JSON.stringify({
        metadata: {
          uri: "/pintura/GET/servicios" // URI de tu servicio
        },
        request: {}
      })
    });

    if (!res.ok) {
      console.error("Respuesta del servidor no fue OK:", res.status);
      setServicios([]);
      return;
    }

    const data = await res.json();

    // Validar que la respuesta sea un arreglo
    const serviciosArray = Array.isArray(data.response?.data) ? data.response.data : [];

    setServicios(serviciosArray.filter((s) => !s.deleted));

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



  const agregarServicio = async (payload) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró un token de autenticación.");
      return;
    }

    try {
      let res;

      if (modoEdicion && tipoEditar) {
        const uri = `/pintura/PUT/servicios/${tipoEditar.idServicio}`;
        const payloadEdicion = {
          metadata: { uri },
          request: payload.request,
        };

        res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payloadEdicion),
        });

        if (res.ok) {
          await obtenerServicios();
          alert("Servicio editado exitosamente.");
        } else {
          const error = await res.json();
          console.error("Error al editar servicio:", error);
          alert("Error al editar: " + JSON.stringify(error.detail || error));
        }
      } else {
        // Crear nuevo
        res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          await obtenerServicios();
          alert("Servicio creado exitosamente.");
        } else {
          const error = await res.json();
          console.error("Error al crear servicio:", error);
          alert("Error: " + JSON.stringify(error.detail || error));
        }
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red: " + error.message);
    }

    toggleModal();
  };


  const eliminarServicio = async (id) => {
      const confirmacion = window.confirm("¿Estás seguro de eliminar este servicio?");
      if (!confirmacion) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token no encontrado.");
        return;
      }

      try {
        const uri = `/pintura/PUT/servicios/${id}`;
        const payload = {
          metadata: { uri },
          request: { deleted: true }
        };

        const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          await obtenerServicios(); // Recarga los datos
          alert("Servicio eliminado lógicamente.");
        } else {
          const error = await res.json();
          console.error("Error al eliminar:", error);
          alert("Error al eliminar: " + JSON.stringify(error.detail || error));
        }
      } catch (error) {
        console.error("Error de red:", error);
        alert("Error de red: " + error.message);
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

  return (
<>
  <Container className="mt-4" fluid>
    <Card className="shadow mb-3 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <h3 className="mb-0">Listado de Servicios</h3>
        <Button color="primary" onClick={toggleModal}>
          Agregar Servicio
        </Button>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table className="table-bordered table-hover table-striped mb-0" responsive>
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
                <td colSpan="4" className="text-center">
                  No hay servicios disponibles
                </td>
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
      </div>
    </Card>

    <ModalAgregarServicio
      isOpen={modal}
      toggle={toggleModal}
      onSubmit={agregarServicio}
      modoEdicion={modoEdicion}
      tipoEditar={tipoEditar}
    />
  </Container>
</>
  );
};

export default TablaServicios;
