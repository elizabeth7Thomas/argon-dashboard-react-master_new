import React, { useState } from "react";
import {
  Card, CardHeader, CardBody, Table, Button,
  FormGroup, Label, Input, Row, Col
} from "reactstrap";

function CarritoPanel({ cart, setCart }) {
  
  const [nit, setNit] = useState("");
  const [idCaja, setIdCaja] = useState("");
  const [idServicioTransaccion, setIdServicioTransaccion] = useState("");
  const [pagoDetalle, setPagoDetalle] = useState({
    noTarjeta: "",
    idMetodo: "",
    monto: "",
    idBanco: ""
  });

  const handleCantidadChange = (id, cantidad) => {
    const nuevaCantidad = parseInt(cantidad, 10);
    if (nuevaCantidad <= 0) {
      setCart(cart.filter(p => p.id !== id));
    } else {
      setCart(cart.map(p => p.id === id ? { ...p, quantity: nuevaCantidad } : p));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

  const handleFinalizarVenta = () => {
    const detalleProductos = cart.map(item => ({
      Producto: item.name,
      Cantidad: item.quantity,
      Precio: item.price,
      Descuento: 0 // puedes cambiar esto si aplicas descuentos
    }));

    const venta = {
      Nit: nit,
      IdCaja: idCaja,
      IdServicioTransaccion: idServicioTransaccion,
      Detalle: detalleProductos,
      MetodosPago: [
        {
          NoTarjeta: pagoDetalle.noTarjeta,
          IdMetodo: pagoDetalle.idMetodo,
          Monto: parseFloat(pagoDetalle.monto || total),
          IdBanco: pagoDetalle.idBanco
        }
      ]
    };

    console.log("Venta procesada:", venta);
    // Aquí enviarías con fetch o axios:
    // axios.post("/api/ventas", venta);

    setCart([]);
  };

  return (
    <Card className="shadow">
      <CardHeader>🛒 Carrito</CardHeader>
      <CardBody>
        <Table responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <Input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleCantidadChange(item.id, e.target.value)
                    }
                    style={{ width: "70px" }}
                  />
                </td>
                <td>Q{item.price}</td>
                <td>Q{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr />
        <h5> Datos de facturación</h5>
        <FormGroup>
          <Label for="nit">NIT</Label>
          <Input type="text" id="nit" value={nit} onChange={(e) => setNit(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="idCaja">ID Caja</Label>
          <Input type="text" id="idCaja" value={idCaja} onChange={(e) => setIdCaja(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="idServicio">ID Servicio/Transacción</Label>
          <Input type="text" id="idServicio" value={idServicioTransaccion} onChange={(e) => setIdServicioTransaccion(e.target.value)} />
        </FormGroup>

        <hr />
        <h5> Método de pago</h5>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="idMetodo">ID Método de Pago</Label>
              <Input
                type="select"
                id="idMetodo"
                value={pagoDetalle.idMetodo}
                onChange={(e) => setPagoDetalle({ ...pagoDetalle, idMetodo: e.target.value })}
              >
                <option value="1">Efectivo</option>
                <option value="2">Tarjeta</option>
                <option value="3">Transferencia</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="idBanco">ID Banco</Label>
              <Input
                type="text"
                id="idBanco"
                value={pagoDetalle.idBanco}
                onChange={(e) => setPagoDetalle({ ...pagoDetalle, idBanco: e.target.value })}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="monto">Monto</Label>
              <Input
                type="number"
                id="monto"
                value={pagoDetalle.monto || total}
                onChange={(e) => setPagoDetalle({ ...pagoDetalle, monto: e.target.value })}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="noTarjeta">No. Tarjeta</Label>
              <Input
                type="text"
                id="noTarjeta"
                value={pagoDetalle.noTarjeta}
                onChange={(e) => setPagoDetalle({ ...pagoDetalle, noTarjeta: e.target.value })}
              />
            </FormGroup>
          </Col>
        </Row>

        <h4>Total: Q{total}</h4>
        <Button color="success" onClick={handleFinalizarVenta}>
          Finalizar venta
        </Button>
      </CardBody>
    </Card>
  );
}

export default CarritoPanel;
