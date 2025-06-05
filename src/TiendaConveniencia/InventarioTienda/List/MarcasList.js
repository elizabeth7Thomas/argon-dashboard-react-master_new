import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Card,
  CardBody
} from 'reactstrap';
import MarcasForm from '../Forms/MarcasForm';

const MarcasList = () => {
  const [marcas, setMarcas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const fetchMarcas = async () => {
    try {
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/GET/marcas/' },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = response.data?.response?.data;

      if (Array.isArray(data)) {
        setMarcas(data);
        console.log(' Marcas cargadas:', data);
      } else {
        console.error(' Respuesta inesperada del servidor:', response.data);
      }
    } catch (error) {
      console.error(' Error al cargar marcas:', error);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return (
    <Card className="shadow mt-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Marcas</h3>
          <Button color="success" size="sm" onClick={toggleModal}>
            Agregar nueva marca
          </Button>
        </div>

        <Table bordered hover responsive>
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha de creación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {marcas.length > 0 ? (
              marcas.map((marca) => (
                <tr key={marca.id}>
                  <td>{marca.id}</td>
                  <td>{marca.nombre}</td>
                  <td>{new Date(marca.fecha_creacion).toLocaleString()}</td>
                  <td>{marca.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay marcas registradas.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {}
        <MarcasForm
          isOpen={modalOpen}
          toggle={toggleModal}
          onCreated={fetchMarcas}
        />
      </CardBody>
    </Card>
  );
};

export default MarcasList;
