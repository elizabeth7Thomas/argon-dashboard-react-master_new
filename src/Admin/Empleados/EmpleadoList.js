// src/Admin/Empleados/EmpleadoList.js
import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Table,
  Button,
  Input
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faIdCard, faPhone, faEnvelope, faUser, faClock } from "@fortawesome/free-solid-svg-icons";

export default function EmpleadoList({
  empleados,
  onEdit,
  onDelete,
  busqueda,
  setBusqueda,
  jornadas = [],
  areas = [],
  roles = []
}) {

  const getJornadaNombre = (id) => {
    const jornada = jornadas.find(j => j.id === id);
    return jornada ? jornada.nombre : id;
  };

  const getAreaNombre = (id) => {
    const area = areas.find(a => a.id === id);
    return area ? area.nombre : id;
  };

  const getRolNombre = (id) => {
    const rol = roles.find(r => r.id === id);
    return rol ? rol.nombre : id;
  };

  const empleadosFiltrados = empleados.filter((item) =>
    (item.empleado.nombres + "" + item.empleado.apellidos).toLowerCase().includes((busqueda || "").toLowerCase()) ||
    (item.empleado.usuario || "" ).toLowerCase().includes((busqueda || "").toLowerCase()) ||
    (item.empleado.id ? item.empleado.id.toString() : "").includes(busqueda || "")
  );

  return (
    <Row>
      <Col>
        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0">Listado de Empleados</h3>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <Input
                  type="text"
                  placeholder="Buscar empleado..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  style={{ maxWidth: "300px", marginRight: "10px" }}
                />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table className="align-items-center table-flush" bordered responsive hover>
              <thead className="thead-light">
                <tr>
                  <th><FontAwesomeIcon icon={faIdCard} className="mr-1" /></th>
                  <th>Nombre completo</th>
                  <th>DPI</th>
                  <th>NIT</th>
                  <th><FontAwesomeIcon icon={faPhone} className="mr-1" /> Teléfono</th>
                  <th><FontAwesomeIcon icon={faEnvelope} className="mr-1" /> Email</th>
                  <th><FontAwesomeIcon icon={faUser} className="mr-1" /> Usuario</th>
                  <th><FontAwesomeIcon icon={faClock} className="mr-1" /> Jornada</th>
                  <th>Área</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.length > 0 ? (
                  empleadosFiltrados.map((item, index) => (
                    <tr key={item.empleado.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.empleado.nombres} {item.empleado.apellidos}</td>
                      <td>{item.empleado.dpi}</td>
                      <td>{item.empleado.nit}</td>
                      <td>{item.empleado.telefono}</td>
                      <td>{item.empleado.email}</td>
                      <td>{item.empleado.usuario}</td>
                      <td>{getJornadaNombre(item.empleado.id_jornada)}</td>
                      <td>{getAreaNombre(item.asignacion.id_area) || item.asignacion.area}</td>
                      <td>{getRolNombre(item.asignacion.id_rol) || item.asignacion.rol}</td>
                      <td>
                        {item.empleado.estado === true
                          ? <span className="text-success font-weight-bold">Activo</span>
                          : <span className="text-danger font-weight-bold">Inactivo</span>
                        }
                      </td>
                      <td>
                        <Button size="sm" color="info" onClick={() => onEdit(item)} className="mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button size="sm" color="danger" onClick={() => onDelete(item.empleado.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center text-muted py-4">
                      No se encontraron empleados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
