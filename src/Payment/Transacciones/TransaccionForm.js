import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

const TransaccionForm = ({
  isOpen,
  toggle,
  onSubmit,
  isEditing,
  formData,
  setFormData
}) => {
  const [detalle, setDetalle] = useState([
    { Producto: "", Cantidad: 1, Precio: 0, Descuento: 0 }
  ]);

  const [metodosPago, setMetodosPago] = useState([
    { IdMetodo: 1, Monto: 0, IdBanco: "", NoTarjeta: "" }
  ]);

  // Para limpiar cuando se abre el modal
  useEffect(() => {
    if (!isOpen) {
      setDetalle([{ Producto: "", Cantidad: 1, Precio: 0, Descuento: 0 }]);
      setMetodosPago([{ IdMetodo: 1, Monto: 0, IdBanco: "", NoTarjeta: "" }]);
    }
  }, [isOpen]);

  const agregarDetalle = () => {
    setDetalle([...detalle, { Producto: "", Cantidad: 1, Precio: 0, Descuento: 0 }]);
  };

  const agregarMetodoPago = () => {
    setMetodosPago([...metodosPago, { IdMetodo: 1, Monto: 0, IdBanco: "", NoTarjeta: "" }]);
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevos = [...detalle];
    nuevos[index][field] = value;
    setDetalle(nuevos);
  };

  const handleMetodoPagoChange = (index, field, value) => {
    const nuevos = [...metodosPago];
    nuevos[index][field] = value;
    setMetodosPago(nuevos);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Nit: formData.Nit || "",
      IdCaja: parseInt(formData.IdCaja || 0),
      IdServicioTransaccion: parseInt(formData.IdServicioTransaccion || 1),
      Detalle: detalle.map(d => ({
        ...d,
        Cantidad: parseInt(d.Cantidad),
        Precio: parseFloat(d.Precio),
        Descuento: parseFloat(d.Descuento)
      })),
      MetodosPago: metodosPago.map(m => ({
        ...m,
        Monto: parseFloat(m.Monto)
      }))
    };

    try {
      const res = await fetch("http://localhost:3001/pagos/transacciones/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error al crear transacción");

      const data = await res.json();
      console.log("Transacción creada:", data);
      onSubmit(); // cerrar modal desde TransaccionesPage
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al crear la transacción");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {isEditing ? "Editar Transacción" : "Nueva Transacción"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleFormSubmit}>
          <FormGroup>
            <Label>NIT</Label>
            <Input
              name="Nit"
              value={formData.Nit || ""}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>ID Caja</Label>
            <Input
              type="number"
              name="IdCaja"
              value={formData.IdCaja || 0}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>ID Servicio Transacción</Label>
            <Input
              type="number"
              name="IdServicioTransaccion"
              value={formData.IdServicioTransaccion || 1}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <h6 className="mt-4">Detalle de Productos</h6>
          {detalle.map((d, index) => (
            <div key={index} className="border p-2 mb-2 rounded bg-light">
              <Input
                placeholder="Producto"
                value={d.Producto}
                onChange={(e) => handleDetalleChange(index, "Producto", e.target.value)}
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Cantidad"
                value={d.Cantidad}
                onChange={(e) => handleDetalleChange(index, "Cantidad", e.target.value)}
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Precio"
                value={d.Precio}
                onChange={(e) => handleDetalleChange(index, "Precio", e.target.value)}
                className="mb-2"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Descuento"
                value={d.Descuento}
                onChange={(e) => handleDetalleChange(index, "Descuento", e.target.value)}
              />
            </div>
          ))}
          <Button size="sm" onClick={agregarDetalle} className="mb-3" color="secondary">
            + Agregar Producto
          </Button>

          <h6>Métodos de Pago</h6>
          {metodosPago.map((m, index) => (
            <div key={index} className="border p-2 mb-2 rounded bg-light">
              <Input
                type="number"
                placeholder="Id Método"
                value={m.IdMetodo}
                onChange={(e) => handleMetodoPagoChange(index, "IdMetodo", e.target.value)}
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Monto"
                value={m.Monto}
                onChange={(e) => handleMetodoPagoChange(index, "Monto", e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Id Banco"
                value={m.IdBanco}
                onChange={(e) => handleMetodoPagoChange(index, "IdBanco", e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="No. Tarjeta"
                value={m.NoTarjeta}
                onChange={(e) => handleMetodoPagoChange(index, "NoTarjeta", e.target.value)}
              />
            </div>
          ))}
          <Button size="sm" onClick={agregarMetodoPago} className="mb-3" color="secondary">
            + Agregar Método de Pago
          </Button>

          <ModalFooter className="p-0 pt-3">
            <Button color="primary" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Transacción"}
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancelar
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default TransaccionForm;
