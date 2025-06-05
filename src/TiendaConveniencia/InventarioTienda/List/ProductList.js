import React, { useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import ProductForm from '../Forms/ProductForm';
import { useProductos } from '../Hooks/useProducts'; // Asegúrate de que esta ruta sea correcta
import axios from 'axios';

const ProductoList = () => {
  const { productos, loading, refetch } = useProductos(); // uso del hook
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

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
      refetch(); // recargar lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

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
      <Button color="primary" className="mt-3" onClick={toggleModal}>
        Agregar producto
      </Button>

      {/* Modal para agregar producto */}
      <ProductForm
        isOpen={modalOpen}
        toggle={toggleModal}
        onCreated={refetch}
      />
    </div>
  );
};

export default ProductoList;
