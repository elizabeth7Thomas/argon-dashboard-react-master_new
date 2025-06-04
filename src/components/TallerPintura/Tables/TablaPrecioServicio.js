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
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const ModalAgregarPrecioServicio = ({
  isOpen,
  toggle,
  modoEdicion = false,
  precioEditar = null,
  onSubmit,
  tiposServicios,
  tiposVehiculos,
}) => {
  const [form, setForm] = useState({
    idTipoServicio: "",
    idTipoVehiculo: "",
    Precio: "",
  });

  useEffect(() => {
    if (modoEdicion && precioEditar) {
      setForm({
        idTipoServicio: precioEditar.idTipoServicio,
        idTipoVehiculo: precioEditar.idTipoVehiculo,
        Precio: precioEditar.Precio,
      });
    } else {
      setForm({
        idTipoServicio: "",
        idTipoVehiculo: "",
        Precio: "",
      });
    }
  }, [modoEdicion, precioEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    const uri = modoEdicion
      ? `/pintura/PUT/precioservicio/${precioEditar.idPrecioServicioVehiculo}`
      : "/pintura/POST/precioservicio";

    const payload = {
      metadata: { uri },
      request: {
        idTipoServicio: parseInt(form.idTipoServicio),
        idTipoVehiculo: parseInt(form.idTipoVehiculo),
        Precio: parseFloat(form.Precio),
      },
    };

    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error en la operación.");
      }

      onSubmit();
      toggle();
    } catch (error) {
      console.error("Error al guardar precio servicio:", error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {modoEdicion ? "Editar Precio de Servicio" : "Agregar Precio de Servicio"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Tipo de Servicio</Label>
            <Input
              type="select"
              name="idTipoServicio"
              value={form.idTipoServicio}
              onChange={handleChange}
            >
              <option value="">-- Selecciona un tipo de servicio --</option>
              {tiposServicios.map((serv) => (
                <option key={serv.idTipoServicio} value={serv.idTipoServicio}>
                  {serv.NombreTipo}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Tipo de Vehículo</Label>
            <Input
              type="select"
              name="idTipoVehiculo"
              value={form.idTipoVehiculo}
              onChange={handleChange}
            >
              <option value="">-- Selecciona un tipo de vehículo --</option>
              {tiposVehiculos.map((veh) => (
                <option key={veh.idTipoVehiculo} value={veh.idTipoVehiculo}>
                  {veh.NombreTipoVehiculo}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Precio</Label>
            <Input
              type="number"
              name="Precio"
              value={form.Precio}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {modoEdicion ? "Guardar Cambios" : "Agregar"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const TablaPrecioServicio = ({ onEditarClick, onVerClick }) => {
  const [precios, setPrecios] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [tiposServicios, setTiposServicios] = useState([]);
  const [modal, setModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [precioEditar, setPrecioEditar] = useState(null);

  const token = localStorage.getItem("token");

  const toggleModal = () => setModal(!modal);

  // Cargar tipos de vehículos
  const obtenerTiposVehiculos = async () => {
    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: { uri: "/pintura/GET/tipovehiculos" },
          request: {},
        }),
      });

      const data = await res.json();
      setTiposVehiculos(data.response?.data || []);
    } catch (error) {
      console.error("Error al obtener tipos de vehículos", error);
      setTiposVehiculos([]);
    }
  };

  // Cargar tipos de servicios
  const obtenerTiposServicios = async () => {
    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          metadata: { uri: "/pintura/GET/tiposervicios" },
          request: {},
        }),
      });

      const data = await res.json();
      setTiposServicios(data.response?.data || []);
    } catch (error) {
      console.error("Error al obtener tipos de servicios", error);
      setTiposServicios([]);
    }
  };

  const obtenerPrecios = async () => {
    try {
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

  useEffect(() => {
    obtenerTiposVehiculos();
    obtenerTiposServicios();
    obtenerPrecios();
  }, []);

  // Función para obtener nombre tipo servicio por id
  const nombreTipoServicio = (id) => {
    const tipo = tiposServicios.find((t) => t.idTipoServicio === id);
    return tipo ? tipo.NombreTipo : "Desconocido";
  };

  // Función para obtener nombre tipo vehículo por id
  const nombreTipoVehiculo = (id) => {
    const veh = tiposVehiculos.find((v) => v.idTipoVehiculo === id);
    return veh ? veh.NombreTipoVehiculo : "Desconocido";
  };

  const handleEditarClick = (item) => {
    setPrecioEditar(item);
    setModoEdicion(true);
    setModal(true);
  };

  const handleVerClick = (item) => {
    onVerClick && onVerClick(item);
  };

  return (
    <>
      <Container className="mt-4" fluid>
        <Card className="shadow mb-3 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <h3 className="mb-0">Listado de Precios por Servicio</h3>
            <Button
              color="primary"
              onClick={() => {
                setModoEdicion(false);
                setPrecioEditar(null);
                toggleModal();
              }}
            >
              Agregar Precio Servicio
            </Button>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table
              className="table-bordered table-hover table-striped mb-0"
              responsive
            >
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Tipo Servicio</th>
                  <th>Tipo Vehículo</th>
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
                      <td>{nombreTipoServicio(item.idTipoServicio)}</td>
                      <td>{nombreTipoVehiculo(item.idTipoVehiculo)}</td>
                      <td>Q{item.Precio.toFixed(2)}</td>
                      <td>{new Date(item.CreatedAt).toLocaleString()}</td>
                      <td>{new Date(item.UpdatedAt).toLocaleString()}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            size="sm"
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem onClick={() => handleVerClick(item)}>
                              Ver
                            </DropdownItem>
                            <DropdownItem onClick={() => handleEditarClick(item)}>
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

        <ModalAgregarPrecioServicio
          isOpen={modal}
          toggle={toggleModal}
          modoEdicion={modoEdicion}
          precioEditar={precioEditar}
          onSubmit={async () => {
            await obtenerPrecios();
            toggleModal();
          }}
          tiposServicios={tiposServicios}
          tiposVehiculos={tiposVehiculos}
        />
      </Container>
    </>
  );
};

export default TablaPrecioServicio;
