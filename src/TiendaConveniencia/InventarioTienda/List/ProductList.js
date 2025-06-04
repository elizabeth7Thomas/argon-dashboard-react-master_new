import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import axios from 'axios';

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchProductos = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://64.23.169.22:3761/broker/api/rest',
      {
        metadata: { uri: 'tienda-conveniencia/GET/productos' },
        request: {}
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Respuesta completa del backend:', response.data);

    const data = response.data?.response?.data;

    if (Array.isArray(data)) {
      setProductos(data);
    } else {
      console.warn('⚠️ La respuesta no contiene un array de productos:', data);
      setProductos([]);
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
    setProductos([]);
  } finally {
    setLoading(false);
  }
};



  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Eliminar este producto?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/DELETE/producto' },
          request: { id }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) {
    return <Spinner color="primary" />;
  }

  return (
  <div>
    <h4 className="mb-3">Listado de Productos</h4>
    <table className="table table-bordered table-striped">
      <thead className="table-white">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock mínimo</th>
          <th>Categoría</th>
          <th>Marca</th>
          <th>Tipo</th>
          <th>Materia Prima</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.length > 0 ? (
          productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>Q{parseFloat(p.precio_referencia).toFixed(2)}</td>
              <td>{p.stock_minimo}</td>
              <td>{p.categoria?.nombre || 'Sin categoría'}</td>
              <td>{p.marca?.nombre || 'Sin marca'}</td>
              <td>{p.tipo}</td>
              <td>{p.es_materia_prima ? 'Sí' : 'No'}</td>
              <td>
                <Button color="warning" size="sm" className="me-2">Editar</Button>
                <Button color="danger" size="sm" onClick={() => eliminarProducto(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center">No hay productos disponibles.</td>
          </tr>
        )}
      </tbody>
    </table>
    
    <p>Total: {productos.length} productos</p>
    <Button color="primary" className="mt-3">Agregar producto</Button>
  </div>
);
};

export default ProductoList;
