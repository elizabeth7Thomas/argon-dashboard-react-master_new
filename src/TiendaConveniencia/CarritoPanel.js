import React, { useState } from "react";
import {
  Card, CardHeader, CardBody, Table, Button,
  FormGroup, Label, Input
} from "reactstrap";

function CarritoPanel({ cart, setCart }) {
  const [nit, setNit] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");

  const handleCantidadChange = (id, cantidad) => {
    const nuevaCantidad = parseInt(cantidad, 10);
    if (nuevaCantidad <= 0) {
      setCart(cart.filter(p => p.id !== id));
    } else {
      setCart(cart.map(p => p.id === id ? { ...p, quantity: nuevaCantidad } : p));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

  const handleFinalizarVenta = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token no disponible. Debes iniciar sesión.");
      return;
    }

    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    if (!nombreCliente || !nit) {
      alert("Por favor, completa los datos del cliente.");
      return;
    }

    const ventaPayload = {
      metadata: {
        uri: "tienda-conveniencia/POST/ventas/"
      },
      request: {
        estado_venta: "COMPLETADA",
        observaciones: "Cliente frecuente",
        nit,
        nombre: nombreCliente,
        usuario_creacion: 1, // Reemplaza con ID real si lo tienes
        detalles: cart.map(item => ({
          id_producto: item.id,
          cantidad: item.quantity
        })),
        pagos: [
          {
            metodo_pago: metodoPago,
            monto: parseFloat(total)
          }
        ]
      }
    };

    try {
      const response = await fetch("http://64.23.169.22:3761/broker/api/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ventaPayload)
      });

      const data = await response.json();

      if (data?.response?._broker_status === 200) {
        alert(" Venta registrada exitosamente.");
        setCart([]);
        setNombreCliente("");
        setNit("");
      } else if (data?.response?._broker_status === 401) {
        alert(" Sesión expirada o token inválido. Vuelve a iniciar sesión.");
      } else {
        console.error("Error del broker:", data);
        alert(` Error al registrar la venta: ${data?.response?._broker_message || 'Intenta nuevamente.'}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert(" Error de red al registrar la venta.");
    }
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
                    onChange={(e) => handleCantidadChange(item.id, e.target.value)}
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
        <h5>Datos de facturación</h5>
        <FormGroup>
          <Label for="nombreCliente">Nombre del Cliente</Label>
          <Input
            type="text"
            id="nombreCliente"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="nit">NIT</Label>
          <Input
            type="text"
            id="nit"
            value={nit}
            onChange={(e) => setNit(e.target.value)}
          />
        </FormGroup>

        <hr />
        <h5>Método de pago</h5>
        <FormGroup>
          <Label for="metodoPago">Método de Pago</Label>
          <Input
            type="select"
            id="metodoPago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </Input>
        </FormGroup>

        <h4>Total: Q{total}</h4>
        <Button color="success" onClick={handleFinalizarVenta}>
          Finalizar venta
        </Button>
      </CardBody>
    </Card>
  );
}

export default CarritoPanel;
