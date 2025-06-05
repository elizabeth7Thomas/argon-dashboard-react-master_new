import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Container,
} from "reactstrap";
import ModalAgregarTipoPintura from "../Modals/ModalAgregarTipoPintura";

const TablaTipoPinturas = () => {
  const [tiposPintura, setTiposPintura] = useState([]);
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

  const obtenerTiposPinturas = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: "/pintura/GET/tipopinturas",
          },
          request: {},
        }),
      });

      const data = await res.json();
      const tipos = Array.isArray(data.response?.data) ? data.response.data : [];
      setTiposPintura(tipos);
    } catch (error) {
      console.error("Error al obtener tipos de pintura:", error);
    }
  };

  const actualizarTipoPintura = async (tipoActualizado) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: {
            uri: `/pintura/PUT/tipopinturas/${tipoActualizado.idTipoPintura}`,
          },
          request: {
            NombreTipoPintura: tipoActualizado.NombreTipoPintura,
          },
        }),
      });

      if (res.ok) {
        obtenerTiposPinturas();
        toggleModal();
      } else {
        console.error("Error al actualizar tipo de pintura");
      }
    } catch (error) {
      console.error("Error en actualización:", error.message);
    }
  };

  const agregarTipoPintura = async (nuevoTipo) => {
    if (modoEdicion && tipoEditar) {
      const tipoConId = {
        ...nuevoTipo,
        idTipoPintura: tipoEditar.idTipoPintura,
      };
      await actualizarTipoPintura(tipoConId);
    } else {
      obtenerTiposPinturas(); // El modal hace el POST
    }
  };

  const iniciarEdicion = (tipo) => {
    setModoEdicion(true);
    setTipoEditar(tipo);
    setModal(true);
  };

  useEffect(() => {
    obtenerTiposPinturas();
  }, []);

  return (
    <Container className="mt-4" fluid>
      <Card className="shadow mb-3 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
          <h3 className="mb-0">Listado de Tipos de Pintura</h3>
          <Button color="primary" onClick={toggleModal}>
            Agregar
          </Button>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table className="table-bordered table-hover table-striped mb-0" responsive>
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nombre del Tipo de Pintura</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposPintura.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay tipos de pintura disponibles.
                  </td>
                </tr>
              ) : (
                tiposPintura.map((tipo) => (
                  <tr key={tipo.idTipoPintura}>
                    <td>{tipo.idTipoPintura}</td>
                    <td>{tipo.NombreTipoPintura}</td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle className="btn-icon-only text-light" size="sm">
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem onClick={() => iniciarEdicion(tipo)}>
                            Editar
                          </DropdownItem>
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

      <ModalAgregarTipoPintura
        isOpen={modal}
        toggle={toggleModal}
        onSubmit={agregarTipoPintura}
        modoEdicion={modoEdicion}
        tipoEditar={tipoEditar}
      />
    </Container>
  );
};

export default TablaTipoPinturas;
