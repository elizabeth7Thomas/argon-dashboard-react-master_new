// src/components/VehiculosMantenimiento.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const VehiculosMantenimiento = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    placa: "",
    marca: "",
    modelo: "",
    anio: "",
    tipovehiculo: "",
    idcliente: "",
  });


  const [busquedaCliente, setBusquedaCliente] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);

  useEffect(() => {
    obtenerTodosLosVehiculos();
    obtenerTodosLosClientes();
  }, []);

  const obtenerTodosLosVehiculos = async () => {
    try {
      const respuesta = await axios.get(`${BASE_URL}/vehiculos`);
      const vehiculosMapeados = respuesta.data.map((v) => ({
        idvehiculo: v.idvehiculo,
        placa: v.placa,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio,
        tipovehiculo: v.tipovehiculo,
        idcliente: v.idcliente,
        status: v.status,
      }));
      setVehiculos(vehiculosMapeados);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  };

  const obtenerTodosLosClientes = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/clientes`);
      // Filtramos solo activos (status = 1)
      const activos = resp.data.filter((c) => c.status === 1);
      // Mapeamos a un formato sencillo
      const clientesMapeados = activos.map((c) => ({
        id: c.idcliente,
        nombreCompleto: `${c.nombre} ${c.apellido}`,
      }));
      setClientesList(clientesMapeados);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Abrir/Cerrar modal de crear o editar
  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      // si abrimos modal para “Nuevo”, limpiamos el formulario
      setFormulario({
        placa: "",
        marca: "",
        modelo: "",
        anio: "",
        tipovehiculo: "",
        idcliente: "",
      });
      setModoEdicion(false);
      setVehiculoEditando(null);
    }
  };

  // Manejador para campos del formulario
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // 2) Agregar Vehículo → POST /vehiculos
  const handleAgregar = async () => {
    // validaciones mínimas
    if (
      !formulario.placa.trim() ||
      !formulario.marca.trim() ||
      !formulario.modelo.trim() ||
      !formulario.idcliente
    )
      return;

    try {
      const nuevo = {
        placa: formulario.placa.trim(),
        marca: formulario.marca.trim(),
        modelo: formulario.modelo.trim(),
        anio: parseInt(formulario.anio, 10) || null,
        tipovehiculo: formulario.tipovehiculo.trim(),
        idcliente: parseInt(formulario.idcliente, 10),
        status: 1,
      };

      await axios.post(`${BASE_URL}/vehiculos`, nuevo);
      // recargamos la lista
      await obtenerTodosLosVehiculos();
      toggle();
    } catch (error) {
      console.error("Error al crear vehículo:", error);
    }
  };

  const handleEditarClick = (vehiculo) => {
    setFormulario({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio.toString(),
      tipovehiculo: vehiculo.tipovehiculo,
      idcliente: vehiculo.idcliente.toString(),
    });
    setModoEdicion(true);
    setVehiculoEditando(vehiculo);
    setModal(true);
  };

  const handleActualizar = async () => {
    if (!vehiculoEditando) return;

    try {
      const actualizado = {
        placa: formulario.placa.trim(),
        marca: formulario.marca.trim(),
        modelo: formulario.modelo.trim(),
        anio: parseInt(formulario.anio, 10) || null,
        tipovehiculo: formulario.tipovehiculo.trim(),
        idcliente: parseInt(formulario.idcliente, 10),
        status: 1,
      };

      await axios.put(
        `${BASE_URL}/vehiculos/${vehiculoEditando.idvehiculo}`,
        actualizado
      );
      // recargamos la lista
      await obtenerTodosLosVehiculos();
      toggle();
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
    }
  };

  const solicitarBorrado = (vehiculo) => {
    setVehiculoAEliminar(vehiculo);
    setShowDeleteModal(true);
  };

  const confirmarBorrado = async () => {
    if (!vehiculoAEliminar) return;

    try {
      await axios.delete(
        `${BASE_URL}/vehiculos/${vehiculoAEliminar.idvehiculo}`
      );
      // recargamos la lista
      await obtenerTodosLosVehiculos();
      setShowDeleteModal(false);
      setVehiculoAEliminar(null);
    } catch (error) {
      console.error("Error al borrar vehículo:", error);
    }
  };

  const cancelarBorrado = () => {
    setShowDeleteModal(false);
    setVehiculoAEliminar(null);
  };

  // Filtrar clientes según texto ingresado en busquedaCliente
  const clientesFiltrados = clientesList.filter((c) =>
    c.nombreCompleto.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  return (
    <>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Lista de Vehículos</h3>
                <Button color="primary" onClick={toggle}>
                  Agregar Vehículo
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive hover className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Año</th>
                      <th>Tipo</th>
                      <th>Cliente</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculos.length > 0 ? (
                      vehiculos.map((vehiculo) => {
                        // obtenemos el nombre del cliente para mostrarlo en la tabla
                        const cliente =
                          clientesList.find(
                            (c) => c.id === vehiculo.idcliente
                          ) || { nombreCompleto: "Desconocido" };
                        return (
                          <tr key={vehiculo.idvehiculo}>
                            <td>{vehiculo.placa}</td>
                            <td>{vehiculo.marca}</td>
                            <td>{vehiculo.modelo}</td>
                            <td>{vehiculo.anio}</td>
                            <td>{vehiculo.tipovehiculo}</td>
                            <td>{cliente.nombreCompleto}</td>
                            <td>
                              <Button
                                size="sm"
                                color="info"
                                className="me-2"
                                onClick={() => handleEditarClick(vehiculo)}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-0" />
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => solicitarBorrado(vehiculo)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} className="mr-0" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No hay vehículos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

      {/* agregar cliente o editar modal */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {modoEdicion ? "Editar Vehículo" : "Agregar Vehículo"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Placa</Label>
              <Input
                type="text"
                name="placa"
                value={formulario.placa}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Marca</Label>
              <Input
                type="text"
                name="marca"
                value={formulario.marca}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Modelo</Label>
              <Input
                type="text"
                name="modelo"
                value={formulario.modelo}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Año</Label>
              <Input
                type="number"
                name="anio"
                value={formulario.anio}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Tipo de Vehículo</Label>
              <Input
                type="text"
                name="tipovehiculo"
                value={formulario.tipovehiculo}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Campo para seleccionar cliente por nombre y buscar */}
            <FormGroup>
              <Label>Buscar Cliente</Label>
              <Input
                type="text"
                placeholder="Escribe nombre o apellido..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                className="mb-2"
              />
              <Input
                type="select"
                name="idcliente"
                value={formulario.idcliente}
                onChange={handleChange}
              >
                <option value="">-- Selecciona un cliente --</option>
                {clientesFiltrados.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombreCompleto}
                  </option>
                ))}
              </Input>
            </FormGroup>
            {/* -------------------------------------------------- */}
          </Form>
        </ModalBody>
        <ModalFooter>
          {modoEdicion ? (
            <Button color="success" onClick={handleActualizar}>
              Actualizar
            </Button>
          ) : (
            <Button color="primary" onClick={handleAgregar}>
              Agregar
            </Button>
          )}
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Confirmación de Borrado */}
      <Modal isOpen={showDeleteModal} toggle={cancelarBorrado}>
        <ModalHeader toggle={cancelarBorrado}>
          Confirmar eliminación
        </ModalHeader>
        <ModalBody>
          {vehiculoAEliminar && (
            <>
              <p>
                Estás a punto de eliminar el vehículo con los siguientes datos:
              </p>
              <ul>
                <li>
                  <strong>Placa:</strong> {vehiculoAEliminar.placa}
                </li>
                <li>
                  <strong>Marca:</strong> {vehiculoAEliminar.marca}
                </li>
                <li>
                  <strong>Modelo:</strong> {vehiculoAEliminar.modelo}
                </li>
              </ul>
              <p>¿Deseas continuar?</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmarBorrado}>
            Sí, eliminar
          </Button>
          <Button color="secondary" onClick={cancelarBorrado}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VehiculosMantenimiento;
