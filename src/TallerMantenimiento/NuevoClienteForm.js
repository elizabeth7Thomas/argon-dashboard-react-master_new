import React from "react";
import { Card, CardHeader, CardBody, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

const NuevoClienteForm = ({
  form,
  modoEditar,
  handleChange,
  agregarCliente,
  actualizarCliente,
  limpiarFormulario,
  setModoEditar,
  onClose
}) => (
  <Card className="shadow mb-4">
    <CardHeader className="border-0">
      <h3>{modoEditar ? "Editar Cliente" : "Registrar Nuevo Cliente"}</h3>
    </CardHeader>
    <CardBody>
      <Row>
        <Col md="6">
          <FormGroup>
            <Label for="idCliente">ID Cliente</Label>
            <Input
              id="idCliente"
              name="idCliente"
              placeholder="Se asigna automáticamente"
              value={form.idCliente}
              disabled
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Nombre del cliente"
              value={form.nombre}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="nit">NIT</Label>
            <Input
              id="nit"
              name="nit"
              placeholder="Documento tributario (opcional)"
              value={form.nit}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="apellido">Apellido</Label>
            <Input
              id="apellido"
              name="apellido"
              placeholder="Apellido del cliente"
              value={form.apellido}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              placeholder="Número de contacto"
              value={form.telefono}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
        </Col>
      </Row>
      <div className="text-right">
        {modoEditar ? (
          <>
            <Button color="warning" onClick={actualizarCliente} className="mr-2">
              <FontAwesomeIcon icon={faEdit} className="mr-1" /> Actualizar Cliente
            </Button>
            <Button color="secondary" onClick={() => { limpiarFormulario(); setModoEditar(false); onClose(); }}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button color="primary" onClick={agregarCliente} className="mr-2">
              <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Agregar Cliente
            </Button>
            <Button color="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </>
        )}
      </div>
    </CardBody>
  </Card>
);

export default NuevoClienteForm;