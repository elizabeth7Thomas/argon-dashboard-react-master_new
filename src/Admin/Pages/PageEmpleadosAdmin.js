// src/Admin/Empleados/Empleados.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes';
import EmpleadoList from '../Empleados/EmpleadoList';
import EmpleadoForm from '../Empleados/EmpleadoForm';
import AsistenciaLis from "../Empleados/AsistenciaLis";
import { Modal, ModalHeader, ModalBody, Button, Table, Input, Spinner, Alert } from 'reactstrap';

export default function Empleados() {
  // Consultar empleados desde la API
  const [empleados, setEmpleados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Modal para pago de salarios
  const [modalPago, setModalPago] = useState(false);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
  const [pagando, setPagando] = useState(false);
  const [pagoMensaje, setPagoMensaje] = useState(null);

  // Filtro/búsqueda de empleado en el modal de pago
  const [filtroEmpleado, setFiltroEmpleado] = useState("");
  const [empleadoFiltrado, setEmpleadoFiltrado] = useState(null);

  // Catálogos
  const [catalogoRoles, setCatalogoRoles] = useState([]);
  const [catalogoServicios, setCatalogoServicios] = useState([]);

  // Consultar empleados desde la API
  const fetchEmpleados = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        metadata: { uri: "administracion/GET/empleados" },
        request: {}
      };
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEmpleados(response.data?.response?.data?.empleados || []);
    } catch (error) {
      setEmpleados([]);
      console.error("Error al obtener empleados:", error);
    }
  };

  // Consultar catálogos de roles y servicios
  const fetchCatalogos = () => {
    setCatalogoRoles(JSON.parse(localStorage.getItem("catalogo_roles") || "[]"));
    setCatalogoServicios(JSON.parse(localStorage.getItem("catalogo_servicios") || "[]"));
  };

  useEffect(() => {
    fetchEmpleados();
    fetchCatalogos();
  }, []);

  // Helpers para mostrar nombre de rol, salario y servicio
  const getRolNombre = (id) => {
    const rol = catalogoRoles.find(r => r.id === id || r.id === Number(id));
    return rol ? rol.nombre : id;
  };
  const getRolSalario = (id) => {
    const rol = catalogoRoles.find(r => r.id === id || r.id === Number(id));
    return rol ? rol.salario : "";
  };
  const getServicioNombre = (id) => {
    const servicio = catalogoServicios.find(s => s.id === id || s.id === Number(id));
    return servicio ? servicio.nombre : id;
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEditingData(null);
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este empleado?")) {
      try {
        await axios.delete(routes.Administracion.Empleados.DELETE(id));
        fetchEmpleados();
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

  const handleSave = async (empleadoPayload) => {
    try {
      if (editingData) {
        await axios.put(routes.Administracion.Empleados.UPDATE(editingData.id), empleadoPayload);
        alert("Empleado actualizado con éxito");
      } else {
        const response = await axios.post(routes.Administracion.Empleados.CREATE, empleadoPayload);
        alert(
          response.data.message +
          (response.data.autenticacion
            ? `\nUsuario: ${response.data.autenticacion.usuario}\nContraseña temporal: ${response.data.autenticacion.contraseniaTemporal}`
            : "")
        );
      }
      fetchEmpleados();
      toggleModal();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      alert("Ocurrió un error al guardar el empleado");
    }
  };

  // Modal de pago de salarios
  const abrirModalPago = () => {
    setEmpleadosSeleccionados([]);
    setPagoMensaje(null);
    setModalPago(true);
  };
  const cerrarModalPago = () => {
    setModalPago(false);
    setPagoMensaje(null);
  };
  const handleSeleccionEmpleado = (id) => {
    setEmpleadosSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(eid => eid !== id)
        : [...prev, id]
    );
  };
  const empleadosFiltrados = empleados.filter(e => {
    const texto = `${e.nombres || e.empleado?.nombres || ""} ${e.apellidos || e.empleado?.apellidos || ""} ${e.usuario || e.empleado?.usuario || ""}`.toLowerCase();
    return texto.includes(filtroEmpleado.toLowerCase());
  });
  const handleSeleccionarEmpleadoFiltro = (id) => {
    setEmpleadoFiltrado(id);
    setEmpleadosSeleccionados([id]);
  };

  const pagarSalarios = async () => {
    setPagando(true);
    setPagoMensaje(null);
    try {
      const empleadosAPagar = empleados.filter(e =>
        empleadosSeleccionados.includes(e.id || e.empleado?.id)
      );
      const salarios = empleadosAPagar.map(e => {
        // Obtener id_rol y id_servicio según la estructura de tu API
        const id_rol = e.rol || e.asignacion?.id_rol || e.id_rol;
        const id_servicio = e.id_servicio || e.empleado?.id_servicio;
        return {
          id: e.id || e.empleado?.id,
          id_tipo_movimiento: 1,
          id_servicio: id_servicio,
          concepto: `Pago de salario para rol ${getRolNombre(id_rol)}`,
          cantidad: getRolSalario(id_rol),
          fecha_movimiento: new Date().toISOString().slice(0, 10),
          nombre_empleado: `${e.nombres || e.empleado?.nombres || ""} ${e.apellidos || e.empleado?.apellidos || ""}`,
          estado: true,
        };
      });

      const payload = {
        metadata: { uri: "administracion/POST/pagar-salario" },
        request: { salarios }
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPagoMensaje({
        tipo: "success",
        texto: response.data?.response?.data?.message || "Salarios pagados correctamente"
      });
      setPagando(false);
      fetchEmpleados();
    } catch (error) {
      setPagoMensaje({
        tipo: "danger",
        texto: "Error al pagar salarios"
      });
      setPagando(false);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mb-2 align-items" onClick={toggleModal}>Agregar Empleado</button>
      <Button color="success" className="mb-2 ml-2" onClick={abrirModalPago}>
        Pagar Salario
      </Button>

      <EmpleadoList 
        empleados={empleados} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onClose={toggleModal} 
      />

      <h4 className="mt-4">Toma de Asistencia</h4>
      <AsistenciaLis empleados={empleados} />

      {/* Modal para pagar salarios */}
      <Modal isOpen={modalPago} toggle={cerrarModalPago}>
        <ModalHeader toggle={cerrarModalPago}>Pagar Salario a Empleados</ModalHeader>
        <ModalBody>
          {pagoMensaje && (
            <Alert color={pagoMensaje.tipo}>{pagoMensaje.texto}</Alert>
          )}

          {/* Filtro de búsqueda de empleado */}
          <Input
            type="text"
            placeholder="Buscar empleado por nombre, apellido o usuario..."
            value={filtroEmpleado}
            onChange={e => setFiltroEmpleado(e.target.value)}
            className="mb-2"
          />

          {/* Select para elegir empleado y seleccionarlo automáticamente */}
          <Input
            type="select"
            value={empleadoFiltrado || ""}
            onChange={e => handleSeleccionarEmpleadoFiltro(e.target.value)}
            className="mb-3"
          >
            <option value="">Seleccione empleado para pagar</option>
            {empleadosFiltrados.map(e => (
              <option key={e.id || e.empleado?.id} value={e.id || e.empleado?.id}>
                {(e.nombres || e.empleado?.nombres || "")} {(e.apellidos || e.empleado?.apellidos || "")} - {(e.usuario || e.empleado?.usuario || "")}
              </option>
            ))}
          </Input>

          <Table bordered responsive>
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Salario</th>
                <th>Servicio</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map(e => {
                const id_rol = e.rol || e.asignacion?.id_rol || e.id_rol;
                const id_servicio = e.id_servicio || e.empleado?.id_servicio;
                return (
                  <tr key={e.id || e.empleado?.id}>
                    <td>
                      <Input
                        type="checkbox"
                        checked={empleadosSeleccionados.includes(e.id || e.empleado?.id)}
                        onChange={() => handleSeleccionEmpleado(e.id || e.empleado?.id)}
                      />
                    </td>
                    <td>{(e.nombres || e.empleado?.nombres || "")} {(e.apellidos || e.empleado?.apellidos || "")}</td>
                    <td>{e.usuario || e.empleado?.usuario || ""}</td>
                    <td>{getRolNombre(id_rol)}</td>
                    <td>{getRolSalario(id_rol)}</td>
                    <td>{getServicioNombre(id_servicio)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Button
            color="primary"
            onClick={pagarSalarios}
            disabled={pagando || empleadosSeleccionados.length === 0}
          >
            {pagando ? <Spinner size="sm" /> : "Pagar salarios seleccionados"}
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{editingData ? "Editar Empleado" : "Nuevo Empleado"}</ModalHeader>
        <ModalBody>
          <EmpleadoForm 
            onSave={handleSave} 
            onCancel={toggleModal} 
            initialData={editingData} 
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
