import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";

const OrdenForm = ({
  orden,
  estadosDetalles = [],
  isOpen,
  toggle,
  onSave,
  onUpdateEstado,
  onUpdateDetalle,
  onReabastecer,
  modo = "crear", // "crear", "editar", "ver"
}) => {
  // Estado para el formulario de orden
  const [form, setForm] = useState({
    fecha_orden: "",
    id_proveedor: "",
    id_servicio: "",
    detalles: [],
  });

  // Estado para edición de estado de la orden
  const [nuevoEstado, setNuevoEstado] = useState("");
  // Estado para edición de estado de detalle
  const [detalleEditando, setDetalleEditando] = useState(null);
  const [nuevoEstadoDetalle, setNuevoEstadoDetalle] = useState("");

  // Cargar datos iniciales si es edición o vista
  useEffect(() => {
    if (orden && modo !== "crear") {
      setForm({
        fecha_orden: orden.fecha_orden || "",
        id_proveedor: orden.proveedor?.id || "",
        id_servicio: orden.servicio?.id || "",
        detalles:
          orden.orden_detalles?.map((d) => ({
            id: d.id,
            id_producto: d.id_producto,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            id_estado_detalle: d.id_estado_detalle,
          })) || [],
      });
    } else {
      // Obtener fecha actual en formato YYYY-MM-DD
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      const fechaActual = `${yyyy}-${mm}-${dd}`;
      setForm({
        fecha_orden: fechaActual,
        id_proveedor: "",
        id_servicio: "",
        detalles: [],
      });
    }
    setNuevoEstado("");
    setDetalleEditando(null);
    setNuevoEstadoDetalle("");
  }, [orden, modo, isOpen]);

  // Manejar cambios en el formulario principal
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar cambios en los detalles
  const handleDetalleChange = (idx, field, value) => {
    const nuevosDetalles = [...form.detalles];
    nuevosDetalles[idx][field] = value;
    setForm({ ...form, detalles: nuevosDetalles });
  };

  // Agregar un producto a la orden
  const handleAgregarDetalle = () => {
    setForm({
      ...form,
      detalles: [
        ...form.detalles,
        { id_producto: "", cantidad: "", precio_unitario: "" },
      ],
    });
  };

  // Eliminar un producto de la orden
  const handleEliminarDetalle = (idx) => {
    const nuevosDetalles = [...form.detalles];
    nuevosDetalles.splice(idx, 1);
    setForm({ ...form, detalles: nuevosDetalles });
  };

  // Guardar orden (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (
      !form.fecha_orden ||
      !form.id_proveedor ||
      !form.id_servicio ||
      form.detalles.length === 0
    )
      return;
    // Adaptar detalles para el endpoint
    const detalles = form.detalles.map((d) => ({
      id_producto: parseInt(d.id_producto),
      cantidad: parseFloat(d.cantidad),
      precio_unitario: parseFloat(d.precio_unitario),
    }));
    onSave({
      fecha_orden: form.fecha_orden,
      id_proveedor: parseInt(form.id_proveedor),
      id_servicio: parseInt(form.id_servicio),
      detalles,
    });
  };

  // Cambiar estado de la orden
  const handleActualizarEstado = () => {
    if (nuevoEstado && orden) {
      onUpdateEstado(orden.id, { estado: parseInt(nuevoEstado) });
    }
  };

  // Cambiar estado de un detalle
  const handleActualizarEstadoDetalle = () => {
    if (detalleEditando && nuevoEstadoDetalle) {
      onUpdateDetalle(detalleEditando.id, {
        estado_detalle_orden: parseInt(nuevoEstadoDetalle),
      });
      setDetalleEditando(null);
      setNuevoEstadoDetalle("");
    }
  };

  // Reabastecer orden
  const handleReabastecer = () => {
    if (orden) {
      onReabastecer(orden.id);
    }
  };

  // Utilidad para mostrar nombre de estado de detalle
  const mapearEstadoDetalle = (id) => {
    const estado = estadosDetalles.find((e) => e.id === id);
    return estado ? estado.nombre : "Desconocido";
  };

  // Cargar catálogos de proveedores, servicios y productos desde localStorage
  const catalogoProveedores = JSON.parse(localStorage.getItem("catalogo_proveedores") || "[]");
  const catalogoServicios = JSON.parse(localStorage.getItem("catalogo_servicios") || "[]");
  const productos = JSON.parse(localStorage.getItem("catalogo_productos") || "[]");

  // Utilidad para mostrar nombre de producto
  const getProductoNombre = (id) => {
    const prod = productos.find((p) => p.id === Number(id));
    return prod ? prod.nombre : id;
  };

  // Utilidad para mostrar nombre de proveedor
  const getProveedorNombre = (id) => {
    const prov = catalogoProveedores.find((p) => p.id === Number(id));
    return prov ? `${prov.nombre} ${prov.apellido}` : id;
  };

  // Utilidad para mostrar nombre de servicio
  const getServicioNombre = (id) => {
    const serv = catalogoServicios.find((s) => s.id === Number(id));
    return serv ? serv.nombre : id;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {modo === "crear"
          ? "Registrar Nueva Orden"
          : `Detalle de la Orden #${orden?.id || ""}`}
      </ModalHeader>
      <ModalBody>
        {(modo === "crear" || modo === "editar") ? (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Fecha de Orden</Label>
                  <Input
                    type="date"
                    name="fecha_orden"
                    value={form.fecha_orden}
                    readOnly
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Proveedor</Label>
                  <Input
                    type="select"
                    name="id_proveedor"
                    value={form.id_proveedor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    {catalogoProveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombres} {p.apellidos}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Servicio</Label>
                  <Input
                    type="select"
                    name="id_servicio"
                    value={form.id_servicio}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    {catalogoServicios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <h5>Productos</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.detalles.map((detalle, idx) => (
                  <tr key={idx}>
                    <td>
                      <Input
                        type="select"
                        value={detalle.id_producto}
                        onChange={(e) =>
                          handleDetalleChange(idx, "id_producto", e.target.value)
                        }
                        required
                      >
                        <option value="">Seleccione</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          handleDetalleChange(idx, "cantidad", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={detalle.precio_unitario}
                        onChange={(e) =>
                          handleDetalleChange(idx, "precio_unitario", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarDetalle(idx)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="text-center">
                    <Button color="success" size="sm" onClick={handleAgregarDetalle}>
                      Agregar Producto
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
            <ModalFooter>
              <Button color="primary" type="submit">
                Guardar
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancelar
              </Button>
            </ModalFooter>
          </Form>
        ) : (
          <>
            <p>
              <strong>Fecha:</strong> {orden?.fecha_orden}
            </p>
            <p>
              <strong>Servicio:</strong> {getServicioNombre(orden?.id_servicio || orden?.servicio?.id)}
            </p>
            <p>
              <strong>Proveedor:</strong> {getProveedorNombre(orden?.id_proveedor || orden?.proveedor?.id)}
            </p>
            <p>
              <strong>Estado:</strong> {orden?.estado_orden?.nombre}
            </p>
            <h5>Productos</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Estado Detalle</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orden?.orden_detalles?.map((detalle) => (
                  <tr key={detalle.id}>
                    <td>{getProductoNombre(detalle.id_producto)}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${detalle.precio_unitario}</td>
                    <td>
                      {detalleEditando && detalleEditando.id === detalle.id ? (
                        <Input
                          type="select"
                          value={nuevoEstadoDetalle}
                          onChange={(e) => setNuevoEstadoDetalle(e.target.value)}
                        >
                          <option value="">Seleccione</option>
                          {estadosDetalles.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.nombre}
                            </option>
                          ))}
                        </Input>
                      ) : (
                        mapearEstadoDetalle(detalle.id_estado_detalle)
                      )}
                    </td>
                    <td>
                      {detalleEditando && detalleEditando.id === detalle.id ? (
                        <>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={handleActualizarEstadoDetalle}
                          >
                            Guardar
                          </Button>
                          <Button
                            color="secondary"
                            size="sm"
                            onClick={() => setDetalleEditando(null)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          color="warning"
                          size="sm"
                          onClick={() => {
                            setDetalleEditando(detalle);
                            setNuevoEstadoDetalle("");
                          }}
                        >
                          Cambiar Estado
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <FormGroup>
              <Label>Cambiar Estado de la Orden</Label>
              <Input
                type="select"
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
              >
                <option value="">Seleccione</option>
                {estadosDetalles.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </Input>
              <Button
                color="primary"
                size="sm"
                className="mt-2"
                onClick={handleActualizarEstado}
                disabled={!nuevoEstado}
              >
                Actualizar Estado
              </Button>
            </FormGroup>
            <Button color="success" onClick={handleReabastecer} className="mt-2">
              Reabastecer Orden
            </Button>
            <Button color="secondary" onClick={toggle} className="mt-2 ml-2">
              Cerrar
            </Button>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default OrdenForm;
