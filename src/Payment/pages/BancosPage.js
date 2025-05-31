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
  Input
} from "reactstrap";

function BancosPage() {
  const [bancos, setBancos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setMensaje("");
  };

  const [form, setForm] = useState({
    nombre: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert("Por favor ingresa el nombre del banco.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/pagos/bancos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ " + data.mensaje);
        setBancos((prev) => [...prev, { id: Date.now(), nombre: form.nombre }]);
        setForm({ nombre: "" });
        toggleModal();
      } else {
        setMensaje("❌ " + data.mensaje);
      }
    } catch (error) {
      setMensaje("❌ Error de red al crear el banco.");
    }
  };

  return (
   
    <Container className="mt-4">
      <h2>Bancos</h2>
      <Button color="primary" onClick={toggleModal}>
        Nuevo Banco
      </Button>

      <Table striped responsive className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {bancos.length === 0 ? (
            <tr>
              <td colSpan="1" className="text-center">
                No hay bancos registrados
              </td>
            </tr>
          ) : (
            bancos.map((banco) => (
              <tr key={banco.id}>
                <td>{banco.nombre}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Registrar Banco</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="nombre">Nombre del banco</Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </FormGroup>
            {mensaje && (
              <p className={mensaje.includes("✅") ? "text-success" : "text-danger"}>
                {mensaje}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Guardar
            </Button>
            <Button color="secondary" onClick={toggleModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
}

export default BancosPage;
