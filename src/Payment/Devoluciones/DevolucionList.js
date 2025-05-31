import HeaderPagos from "components/Headers/HeaderPagos";
import React, { useState } from "react";
import {
  Container,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";

function DevolucionesList() {
  // Estado de devoluciones (array)
  const [devoluciones, setDevoluciones] = useState([]);

  // Modal y formulario
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // Estado formulario
  const [form, setForm] = useState({
    id_venta: "",
    fecha_devolucion: "",
    motivo: "",
    estado: "pendiente",
    usuario_creacion: "",
    detalles: [
      {
        id_detalle_venta: "",
        cantidad: "",
        monto_reembolso: ""
      }
    ]
  });

  // Cambiar datos en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Cambiar detalle (solo un detalle en este ejemplo para simplificar)
  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      detalles: [{ ...prev.detalles[0], [name]: value }]
    }));
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar datos mínimos
    if (!form.id_venta || !form.fecha_devolucion || !form.motivo || !form.usuario_creacion) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    // Agregar devolución a la lista
    setDevoluciones(prev => [...prev, { ...form, id: Date.now() }]);

    // Cerrar modal y resetear formulario
    toggleModal();
    setForm({
      id_venta: "",
      fecha_devolucion: "",
      motivo: "",
      estado: "pendiente",
      usuario_creacion: "",
      detalles: [
        {
          id_detalle_venta: "",
          cantidad: "",
          monto_reembolso: ""
        }
      ]
    });
  };

  return (
    <>
    <br></br>
    
    <Container className="mt-4">
      <h2>Devoluciones</h2>
     

      <Table striped responsive className="mt-3">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha Devolución</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Usuario Creación</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {devoluciones.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No hay devoluciones registradas</td>
            </tr>
          ) : (
            devoluciones.map(d => (
              <tr key={d.id}>
                <td>{d.id_venta}</td>
                <td>{new Date(d.fecha_devolucion).toLocaleString()}</td>
                <td>{d.motivo}</td>
                <td>{d.estado}</td>
                <td>{d.usuario_creacion}</td>
                <td>
                  {d.detalles.map((det, i) => (
                    <div key={i}>
                      ID Detalle: {det.id_detalle_venta}, Cantidad: {det.cantidad}, Monto Reembolso: Q{det.monto_reembolso}
                    </div>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal para nueva devolución */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Nueva Devolución</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="id_venta">ID Venta</Label>
              <Input
                type="number"
                id="id_venta"
                name="id_venta"
                value={form.id_venta}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="fecha_devolucion">Fecha Devolución</Label>
              <Input
                type="datetime-local"
                id="fecha_devolucion"
                name="fecha_devolucion"
                value={form.fecha_devolucion}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="motivo">Motivo</Label>
              <Input
                type="textarea"
                id="motivo"
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="estado">Estado</Label>
              <Input
                type="select"
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesado">Procesado</option>
                <option value="cancelado">Cancelado</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="usuario_creacion">ID Usuario Creación</Label>
              <Input
                type="number"
                id="usuario_creacion"
                name="usuario_creacion"
                value={form.usuario_creacion}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <hr />
            <h5>Detalle</h5>

            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="id_detalle_venta">ID Detalle Venta</Label>
                  <Input
                    type="number"
                    id="id_detalle_venta"
                    name="id_detalle_venta"
                    value={form.detalles[0].id_detalle_venta}
                    onChange={handleDetalleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="cantidad">Cantidad</Label>
                  <Input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    min="1"
                    value={form.detalles[0].cantidad}
                    onChange={handleDetalleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="monto_reembolso">Monto Reembolso</Label>
                  <Input
                    type="number"
                    id="monto_reembolso"
                    name="monto_reembolso"
                    step="0.01"
                    min="0"
                    value={form.detalles[0].monto_reembolso}
                    onChange={handleDetalleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">Guardar</Button>
            <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
          </ModalFooter>
        </Form>
      </Modal>
       <Button color="primary" onClick={toggleModal}>Nueva Devolución</Button>
    </Container>
    </>
  );
}

export default DevolucionesList;
