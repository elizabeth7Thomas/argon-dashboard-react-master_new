import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Card,
  CardBody,
  Spinner,
  Button,
  Collapse
} from 'reactstrap';
import CategoriasForm from '../Forms/CategoriasForm';

const CategoriasList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCollapse, setOpenCollapse] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/GET/categorias' },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data?.response?.data;

      if (Array.isArray(data)) {
        setCategorias(data);
      } else {
        console.warn('Respuesta inesperada:', data);
        setCategorias([]);
      }
    } catch (error) {
      console.error(' Error al cargar categorías:', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const toggleCollapse = (id) => {
    setOpenCollapse((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Card className="shadow mt-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Listado de Categorías</h4>
          <Button color="success" size="sm" onClick={() => setModalOpen(true)}>
            Agregar nueva categoría
          </Button>

        </div>

        {loading ? (
          <Spinner color="primary" />
        ) : (
          <Table bordered hover responsive>
            <thead className="table-white">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <React.Fragment key={categoria.id}>
                  <tr>
                    <td>{categoria.id}</td>
                    <td>{categoria.nombre}</td>
                    <td>{categoria.descripcion}</td>
                    <td>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => toggleCollapse(categoria.id)}
                      >
                        {openCollapse[categoria.id] ? 'Ocultar' : 'Ver'} productos
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ padding: 0 }}>
                      <Collapse isOpen={openCollapse[categoria.id]}>
                        <div className="p-3 bg-light">
                          {categoria.productos.length === 0 ? (
                            <p className="mb-0">No hay productos en esta categoría.</p>
                          ) : (
                            <Table size="sm" bordered>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Descripción</th>
                                  <th>Precio</th>
                                  <th>Stock mínimo</th>
                                  <th>Tipo</th>
                                  <th>Materia Prima</th>
                                </tr>
                              </thead>
                              <tbody>
                                {categoria.productos.map((p) => (
                                  <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.descripcion}</td>
                                    <td>Q{parseFloat(p.precio_referencia).toFixed(2)}</td>
                                    <td>{p.stock_minimo}</td>
                                    <td>{p.tipo}</td>
                                    <td>{p.es_materia_prima ? 'Sí' : 'No'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
        <p>Total: {categorias.length} categorías</p>
        <CategoriasForm
  isOpen={modalOpen}
  toggle={() => setModalOpen(!modalOpen)}
  onCreated={fetchCategorias}
/>

      </CardBody>
    </Card>
  );
};

export default CategoriasList;
