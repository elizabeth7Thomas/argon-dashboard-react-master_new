import React from "react";
import { Card, CardHeader, CardBody, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

const NuevoEmpleadoForm = ({
  form,
  modoEditar,
  handleChange,
  agregarEmpleado,
  actualizarEmpleado,
  limpiarFormulario,
  setModoEditar,
  onClose
}) => (
  <Card className="shadow mb-4">
    <CardHeader className="border-0">
      <h3>{modoEditar ? "Editar Empleado" : "Registrar Nuevo Empleado"}</h3>
    </CardHeader>
    <CardBody>
      <Row>
        <Col md="12">
          <FormGroup>
            <Label for="idEmpleado">ID Empleado</Label>
            <Input
              id="idEmpleado"
              name="idEmpleado"
              value={form.idEmpleado}
              disabled
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="apellido">Apellido</Label>
            <Input
              id="apellido"
              name="apellido"
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
              value={form.email}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="cargo">Cargo</Label>
            <Input
              id="cargo"
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
          <FormGroup>
            <Label for="salario">Salario</Label>
            <Input
              id="salario"
              name="salario"
              type="number"
              value={form.salario}
              onChange={handleChange}
              className="mb-3"
            />
          </FormGroup>
        </Col>
      </Row>
      <div className="text-right">
        {modoEditar ? (
          <>
            <Button color="warning" onClick={actualizarEmpleado} className="mr-2">
              <FontAwesomeIcon icon={faEdit} className="mr-1" /> Actualizar Empleado
            </Button>
            <Button color="secondary" onClick={() => { limpiarFormulario(); setModoEditar(false); onClose(); }}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button color="primary" onClick={agregarEmpleado} className="mr-2">
              <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Agregar Empleado
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

export default NuevoEmpleadoForm;