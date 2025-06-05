import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";

const ModalAgregarVenta = ({ isOpen, toggle, onSubmit }) => {
  const [form, setForm] = useState({
    Nit: "",
    TipoVehiculo: "",
    IdServicioTransaccion: "7",
    Detalle: [],
    MetodosPago: [],
  });

  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async (uri) => {
    try {
      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ metadata: { uri }, request: {} }),
      });
      const data = await res.json();
      return data.response?.data || [];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  const obtenerDatos = async () => {
    const [clientesData, vehiculosData, serviciosData, metodosPagoData, preciosData, bancosDataRaw, tiposServicioData] = await Promise.all([
      fetchData("/pagos/cliente/obtener"),
      fetchData("/pintura/GET/tipovehiculos"),
      fetchData("/pintura/GET/servicios"),
      fetchData("/pagos/metodos/obtener"),
      fetchData("/pintura/GET/precioservicio"),
      fetchData("/pagos/bancos/obtener"),
      fetchData("/pintura/GET/tiposervicios"),
    ]);

    setClientes(clientesData?.clientes || []);
    setVehiculos(vehiculosData);
    setServicios(serviciosData);
    setMetodosPago(metodosPagoData);
    setPrecios(preciosData);
    setBancos(bancosDataRaw?.Bancos || []);
    setTiposServicio(tiposServicioData);
  };

  useEffect(() => {
    if (isOpen) obtenerDatos();
  }, [isOpen]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetalleChange = (index, field, value) => {
    const updated = [...form.Detalle];
    updated[index][field] = value;

    if ((field === "Producto" || field === "Cantidad") && value !== "") {
      const idServicio = field === "Producto" ? Number(value) : Number(updated[index].Producto);
      const idTipoVehiculo = Number(form.TipoVehiculo);

      const tipo = tiposServicio.find(t => t.idServicio === idServicio);
      const idTipoServicio = tipo?.idTipoServicio;

      if (idTipoServicio && idTipoVehiculo) {
        const precioObj = precios.find(
          (p) => p.idTipoServicio === idTipoServicio && p.idTipoVehiculo === idTipoVehiculo
        );
        updated[index].Precio = precioObj ? precioObj.Precio : 0;
      }
    }

    setForm({ ...form, Detalle: updated });
  };

  useEffect(() => {
    if (!form.TipoVehiculo) return;

    const updated = form.Detalle.map((item) => {
      const idServicio = Number(item.Producto);
      const idTipoVehiculo = Number(form.TipoVehiculo);
      if (!idServicio || !idTipoVehiculo) return item;

      const tipo = tiposServicio.find(t => t.idServicio === idServicio);
      const idTipoServicio = tipo?.idTipoServicio;

      const precioObj = precios.find(
        (p) => p.idTipoServicio === idTipoServicio && p.idTipoVehiculo === idTipoVehiculo
      );

      return {
        ...item,
        Precio: precioObj ? precioObj.Precio : 0,
      };
    });

    setForm((f) => ({ ...f, Detalle: updated }));
  }, [form.TipoVehiculo, form.Detalle.length, precios, tiposServicio]);

  const handlePagoChange = (index, field, value) => {
    const updated = [...form.MetodosPago];
    updated[index][field] = value;
    setForm({ ...form, MetodosPago: updated });
  };

  const agregarDetalle = () => {
    setForm({
      ...form,
      Detalle: [...form.Detalle, { Producto: "", Cantidad: "1", Precio: 0, Descuento: "0" }],
    });
  };

  const agregarMetodoPago = () => {
    setForm({
      ...form,
      MetodosPago: [...form.MetodosPago, { NoTarjeta: "", IdMetodo: "", Monto: "", IdBanco: "" }],
    });
  };

  const handleSubmit = () => {
  if (!form.Nit || !form.TipoVehiculo || form.Detalle.length === 0 || form.MetodosPago.length === 0) {
    alert("Por favor completa todos los campos requeridos.");
    return;
  }

  const tipoVehiculoObj = vehiculos.find(v => v.idTipoVehiculo === Number(form.TipoVehiculo));
  const tipoVehiculoNombre = tipoVehiculoObj ? tipoVehiculoObj.NombreTipoVehiculo : "";

  const detalleFormateado = form.Detalle.map(item => {
    const servicioObj = servicios.find(s => s.idServicio === Number(item.Producto));
    const nombreProducto = servicioObj ? servicioObj.NombreServicio : "";

    return {
      Producto: nombreProducto,
      Cantidad: String(item.Cantidad),
      Precio: String(item.Precio),
      Descuento: String(item.Descuento),
    };
  });
  const metodoIdMap = {};
  metodosPago.forEach((mp, idx) => {
    metodoIdMap[mp.idMetodo] = String(idx + 1);
  });

  const metodosPagoFormateados = form.MetodosPago.map(mp => ({
    NoTarjeta: String(mp.NoTarjeta),
    IdMetodo: metodoIdMap[mp.IdMetodo] || "1", // Por defecto "1" si no encuentra
    Monto: String(mp.Monto),
    IdBanco: String(mp.IdBanco),
  }));

  const venta = {
    Nit: form.Nit,
    IdCaja: "1",
    TipoVehiculo: tipoVehiculoNombre,
    IdServicioTransaccion: "7",
    Detalle: detalleFormateado,
    MetodosPago: metodosPagoFormateados,
  };

  enviarVenta(venta);
};

  const enviarVenta = async (ventaData) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        metadata: { uri: "/pintura/POST/venta" },
        request: ventaData,
      };
      console.log("Payload a enviar:", JSON.stringify(payload, null, 2));

      const res = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Venta registrada correctamente");
        toggle();
        onSubmit();
      } else {
        alert("Error al registrar la venta: " + (data.message || JSON.stringify(data)));
      }
    } catch (error) {
      alert("Error en la conexión: " + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Agregar Venta</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="Nit">Cliente (NIT)</Label>
            <Input type="select" name="Nit" value={form.Nit} onChange={handleFormChange}>
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente.nit}>
                  {cliente.nombreCliente} {cliente.apellidosCliente}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="TipoVehiculo">Tipo de Vehículo</Label>
            <Input type="select" name="TipoVehiculo" value={form.TipoVehiculo} onChange={handleFormChange}>
              <option value="">Selecciona tipo de vehículo</option>
              {vehiculos.map((veh) => (
                <option key={veh.idTipoVehiculo} value={veh.idTipoVehiculo}>
                  {veh.NombreTipoVehiculo}
                </option>
              ))}
            </Input>
          </FormGroup>

          <hr />
          <h5>Detalle de Productos</h5>
          {form.Detalle.map((item, idx) => (
            <Row key={idx} className="mb-2">
              <Col md={3}>
                <Input
                    type="select"
                    value={item.Producto}
                    onChange={(e) => handleDetalleChange(idx, "Producto", e.target.value)}
                    disabled={!form.TipoVehiculo}
                  >
                  <option value="">Producto</option>
                    {servicios.map((srv) => (
                      <option key={srv.idServicio} value={srv.idServicio}>
                        {srv.NombreServicio}
                      </option>
                    ))}
                </Input>
              </Col>
              <Col md={2}>
                <Input
                  type="number"
                  min="1"
                  value={item.Cantidad}
                  onChange={(e) => handleDetalleChange(idx, "Cantidad", e.target.value)}
                  placeholder="Cantidad"
                />
              </Col>
              <Col md={3}>
                <Input type="number" value={item.Precio} disabled placeholder="Precio" />
              </Col>
              <Col md={2}>
                <Input
                  type="number"
                  min="0"
                  value={item.Descuento}
                  onChange={(e) => handleDetalleChange(idx, "Descuento", e.target.value)}
                  placeholder="Descuento"
                />
              </Col>
            </Row>
          ))}
          <Button color="secondary" onClick={agregarDetalle}>
            Agregar Producto
          </Button>

          <hr />
          <h5>Métodos de Pago</h5>
          {form.MetodosPago.map((pago, idx) => (
            <Row key={idx} className="mb-2">
              <Col md={3}>
                <Input
                  type="text"
                  value={pago.NoTarjeta}
                  onChange={(e) => handlePagoChange(idx, "NoTarjeta", e.target.value)}
                  placeholder="No. Tarjeta"
                />
              </Col>
              <Col md={3}>
                <Input
                  type="select"
                  value={pago.IdMetodo}
                  onChange={(e) => handlePagoChange(idx, "IdMetodo", e.target.value)}
                >
                  <option value="">Método</option>
                  {metodosPago.map((mp) => (
                    <option key={mp.idMetodo} value={mp.idMetodo}>
                      {mp.Metodo}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col md={2}>
                <Input
                  type="number"
                  value={pago.Monto}
                  onChange={(e) => handlePagoChange(idx, "Monto", e.target.value)}
                  placeholder="Monto"
                />
              </Col>
              <Col md={4}>
                <Input
                  type="select"
                  value={pago.IdBanco}
                  onChange={(e) => handlePagoChange(idx, "IdBanco", e.target.value)}
                >
                  <option value="">Selecciona Banco</option>
                  {bancos.map((banco) => (
                    <option key={banco._id} value={banco._id}>
                      {banco.nombre}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          ))}
          <Button color="secondary" onClick={agregarMetodoPago}>
            Agregar Método de Pago
          </Button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Guardar Venta
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAgregarVenta;
