import React, { useState } from "react";
import { Button, Table, Container, Row, Col } from "reactstrap";
import ModalEmpleado from "../../components/Administracion/Modals/ModalEmpleados"; // Asegúrate de que el path sea correcto
import HeaderAdniminstracion from "components/Headers/HeaderAdministracion"; // Asegúrate de que el path sea correcto

const Administracion = () => {
  const [empleados, setEmpleados] = useState([
    // Ejemplo de empleados, puedes reemplazarlo con datos reales
    {
      dpi: 4345657860901,
      nombres: "Carlos",
      apellidos: "Gomez",
      telefono: 12345678,
      direccion: "Calle Falsa 123",
      nit: "1234567890",
      idJornada: 1,
      genero: 1,
      idArea: 1,
      rol: "Administrador",
    },
    {
      dpi: 4345657860902,
      nombres: "Maria",
      apellidos: "Perez",
      telefono: 87654321,
      direccion: "Avenida Siempre Viva 456",
      nit: "0987654321",
      idJornada: 2,
      genero: 2,
      idArea: 2,
      rol: "Empleado",
    },
    // Puedes agregar más empleados aquí si es necesario
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleAddEmpleado = (empleado) => {
    setEmpleados([...empleados, empleado]);
  };

  const handleEditEmpleado = (empleado) => {
    const updatedEmpleados = empleados.map((emp) =>
      emp.dpi === empleado.dpi ? empleado : emp
    );
    setEmpleados(updatedEmpleados);
  };

  const handleDeleteEmpleado = (dpi) => {
    const filteredEmpleados = empleados.filter((emp) => emp.dpi !== dpi);
    setEmpleados(filteredEmpleados);
  };

  return (
    <>
    <HeaderAdniminstracion/>
    <Container>
      <Row>
        <Col>
          <h2>Administración de Empleados</h2>
          <Button
            color="primary"
            onClick={() => {
              setSelectedEmpleado(null);
              toggleModal();
            }}
            className="mb-3"
          >
            Agregar Empleado
          </Button>
          <Table striped>
            <thead>
              <tr>
                <th>DPI</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>NIT</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.dpi}>
                  <td>{empleado.dpi}</td>
                  <td>{empleado.nombres}</td>
                  <td>{empleado.apellidos}</td>
                  <td>{empleado.telefono}</td>
                  <td>{empleado.direccion}</td>
                  <td>{empleado.nit}</td>
                  <td>{empleado.rol}</td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => {
                        setSelectedEmpleado(empleado);
                        toggleModal();
                      }}
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      color="danger"
                      onClick={() => handleDeleteEmpleado(empleado.dpi)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal de Empleado */}
          <ModalEmpleado
            isOpen={modalOpen}
            toggle={toggleModal}
            empleado={selectedEmpleado}
            onSubmit={selectedEmpleado ? handleEditEmpleado : handleAddEmpleado}
          />
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Administracion;
