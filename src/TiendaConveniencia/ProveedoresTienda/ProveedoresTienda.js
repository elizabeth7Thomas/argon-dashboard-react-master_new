import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import HeaderTienda from "components/Headers/HeaderTienda";

const API = "http://localhost:3001/administracion/proveedores";

function ProveedoresTienda() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorActual, setProveedorActual] = useState(null);
  const [busquedaId, setBusquedaId] = useState("");
  const [modal, setModal] = useState(false);

  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    nit: ""
  });

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const toggleModal = () => setModal(!modal);

  const obtenerProveedores = async () => {
    const res = await fetch(API);
    const data = await res.json();
    const lista = Object.entries(data.proveedores).map(([id, proveedor]) => ({ id, ...proveedor }));
    setProveedores(lista);
  };

  const buscarPorId = async () => {
    if (!busquedaId) return alert("Ingresa un ID válido");
    const res = await fetch(`${API}/${busquedaId}`);
    const data = await res.json();
    setProveedorActual({ id: busquedaId, ...data });
    setFormulario(data);
    toggleModal(); // Abrimos el modal con los datos
  };

  const handleInputChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarProveedor = async () => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });
    const data = await res.json();
    alert(data.message || "Proveedor registrado con éxito");
    setFormulario({ nombres: "", apellidos: "", telefono: "", direccion: "", nit: "" });
    obtenerProveedores();
    toggleModal();
  };

  const actualizarProveedor = async () => {
    const res = await fetch(`${API}/${proveedorActual.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });
    const data = await res.json();
    alert(data.message || "Proveedor actualizado con éxito");
    setProveedorActual(null);
    setFormulario({ nombres: "", apellidos: "", telefono: "", direccion: "", nit: "" });
    obtenerProveedores();
    toggleModal();
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm("¿Deseas eliminar este proveedor?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    obtenerProveedores();
  };

  return (
    <>
      <HeaderTienda />
      <Card className="shadow mt-4">
        <CardHeader>
          📦 Proveedores
         
        </CardHeader>
        <CardBody>
          <Form inline className="mb-3">
            <Input
              placeholder="Buscar por ID"
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
            />
            <Button color="primary" onClick={buscarPorId} className="ms-2">
              Buscar
            </Button>
          </Form>

          <h5>Lista de Proveedores</h5>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>NIT</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.id}</td>
                  <td>{prov.nombres}</td>
                  <td>{prov.apellidos}</td>
                  <td>{prov.telefono}</td>
                  <td>{prov.direccion}</td>
                  <td>{prov.nit}</td>
                  <td>
                    <Button
                      size="sm"
                      color="info"
                      onClick={() => {
                        setProveedorActual(prov);
                        setFormulario(prov);
                        toggleModal();
                      }}
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => eliminarProveedor(prov.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br></br>
          <Button color="success" className="float-end" onClick={() => {
            setProveedorActual(null);
            setFormulario({ nombres: "", apellidos: "", telefono: "", direccion: "", nit: "" });
            toggleModal();
          }}>
            Agregar proveedor
          </Button>
        </CardBody>
      </Card>

      {/* Modal para Crear/Editar */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {proveedorActual ? "Editar Proveedor" : "Agregar Proveedor"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nombres</Label>
              <Input
                name="nombres"
                value={formulario.nombres}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Apellidos</Label>
              <Input
                name="apellidos"
                value={formulario.apellidos}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Teléfono</Label>
              <Input
                name="telefono"
                type="number"
                value={formulario.telefono}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Dirección</Label>
              <Input
                name="direccion"
                value={formulario.direccion}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>NIT</Label>
              <Input
                name="nit"
                value={formulario.nit}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color={proveedorActual ? "warning" : "success"}
            onClick={proveedorActual ? actualizarProveedor : guardarProveedor}
          >
            {proveedorActual ? "Actualizar" : "Guardar"}
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ProveedoresTienda;
