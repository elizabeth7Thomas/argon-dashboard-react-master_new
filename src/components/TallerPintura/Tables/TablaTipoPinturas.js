import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Table,Card,Button,DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown,Container,} from "reactstrap";
import ModalAgregarTipoPintura from "../Modals/ModalAgregarTipoPintura";


const TablaTipoPinturas = () => {
  const [tiposPintura, setTiposPintura] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoEditar, setTipoEditar] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setModoEdicion(false);
      setTipoEditar(null);
    }
  };

  const obtenerTiposPinturas = async () =>{
    const token = localStorage.getItem("token");

    if(!token){
      setError("No se encontro un token de autenticación");
      setLoading(false);
      return
    }

    try{
      const res = await fetch("http://localhost:8000/pintura/GET/tipopinturas");
      const data = await res.json();
      const TiposPinturaArray = Array.isArray(data) ? data : [data];
      setTiposPintura(TiposPinturaArray);

      if(TiposPinturaArray.length > 0){
        const maxId = Math.max(...TiposPinturaArray.map(i => i.idTipoPintura));
        setNextId(maxId + 1);
      }
    }catch (error) {
     console.error("Error al obtener los datos", error);
     setTiposPintura([]);   
    }
  }

  const agregarTipoPintura = (nuevoTipo) => {
    if (modoEdicion && tipoEditar) {
      // Editar
      const tiposActualizados = tiposPintura.map((tipo) =>
        tipo.idTipoPintura === tipoEditar.idTipoPintura
          ? { ...tipo, NombreTipoPintura: nuevoTipo.NombreTipoPintura }
          : tipo
      );
      setTiposPintura(tiposActualizados);
    } else {
      // Agregar
      const nuevoTipoConId = {
        idTipoPintura: nextId,
        ...nuevoTipo,
      };
      setTiposPintura([...tiposPintura, nuevoTipoConId]);
      setNextId(nextId + 1);
    }
    toggleModal();
  };

  const eliminarTipoPintura = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este tipo de pintura?");
    if (confirmacion) {
      const nuevosTipos = tiposPintura.filter((tipo) => tipo.idTipoPintura !== id);
      setTiposPintura(nuevosTipos);
    }
  };

  const iniciarEdicion = (tipo) => {
    setModoEdicion(true);
    setTipoEditar(tipo);
    setModal(true);
  };

  useEffect(() => {
    // Inicializar tipos de pintura vacíos (local)
    obtenerTiposPinturas([]);
  }, []);

  return (
    <>
      
      <br></br> <br></br>
      <Container className="mt--7" fluid>
      
        <Card className="shadow p-4 mb-4">
          <Table className="align-items-center table-flush" responsive>
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
                          <DropdownItem onClick={() => alert(`Ver: ${tipo.NombreTipoPintura}`)}>
                            Ver
                          </DropdownItem>
                          <DropdownItem onClick={() => iniciarEdicion(tipo)}>
                            Editar
                          </DropdownItem>
                          <DropdownItem onClick={() => eliminarTipoPintura(tipo.idTipoPintura)}>
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
          <ModalAgregarTipoPintura
            isOpen={modal}
            toggle={toggleModal}
            onSubmit={agregarTipoPintura}
            modoEdicion={modoEdicion}
            tipoEditar={tipoEditar}
          />
        </Card>
          <Button color="primary" onClick={toggleModal}>
          Agregar Tipo de Pintura
        </Button>
      </Container>

    </>
  );
};

export default TablaTipoPinturas;
