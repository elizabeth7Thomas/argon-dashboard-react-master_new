import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody,
  Button, Badge, Modal
} from 'reactstrap';
import Header from "components/Headers/HeaderAdministracion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import EmpleadoForm from './EmpleadoForm';
import EmpleadoList from './EmpleadoList';
import routes from 'routes';
import axios from 'axios';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setEditingData(null);
  };

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(routes.Administracion.Empleados);
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleSave = async (empleado) => {
    try {
      if (editingData) {
        await axios.put(`${routes.Administracion.Empleados}/${editingData.empleadoId}`, empleado);
      } else {
        await axios.post(routes.Administracion.Empleados, empleado);
      }
      fetchEmpleados();
      toggleModal();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
    }
  };

  const handleEdit = (empleado) => {
    setEditingData(empleado);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este empleado?")) {
      try {
        await axios.delete(`${routes.Administracion.Empleados}/${id}`);
        fetchEmpleados();
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h3>
                      <FontAwesomeIcon icon={faUsers} className="mr-2" />
                      Gestión de Empleados
                    </h3>
                  </Col>
                  <Col className="text-right">
                    <Badge color="info" pill>Activo</Badge>
                  </Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Listado de Empleados</h4>
                  <Button color="success" onClick={toggleModal}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nuevo Empleado
                  </Button>
                </div>
                <EmpleadoList
                  empleados={empleados}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={() => {}}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal Formulario */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <EmpleadoForm
            onSave={handleSave}
            onCancel={toggleModal}
            initialData={editingData}
          />
        </Modal>
      </Container>
    </>
  );
}