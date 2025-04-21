import React, { useState } from "react";
import { Button, Table } from "reactstrap";
import ModalEmpleado from "../Modals/ModalEmpleado"; // Importamos el Modal

const Empleados = () => {
  const [empleados, setEmpleados] = useState([
    // Datos de ejemplo. Aquí puedes manejar el estado con la API si lo deseas
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
    // Puedes añadir más empleados aquí.
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
    <div>
      <Button color="primary" onClick={() => { setSelectedEmpleado(null); toggleModal(); }}>
        Agregar Empleado
      </Button>
      <Table>
        <thead>
          <tr>
            <th>DPI</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>NIT</th>
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
              <td>
                <Button
                  color="warning"
                  onClick={() => { setSelectedEmpleado(empleado); toggleModal(); }}
                >
                  Editar
                </Button>
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

      <ModalEmpleado
        isOpen={modalOpen}
        toggle={toggleModal}
        empleado={selectedEmpleado}
        onSubmit={selectedEmpleado ? handleEditEmpleado : handleAddEmpleado}
      />
    </div>
  );
};

export default Empleados;
