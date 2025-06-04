// ProductListSoloVista.js
import React from 'react';
import { Spinner, Button } from 'reactstrap';
import { useProductos } from '../Hooks/useProducts';

const ProductoListSoloVista = ({ onAdd }) => {
  const { productos, loading } = useProductos();

  if (loading) {
    return <Spinner color="primary" />;
  }

  return (
    <div>
      <h4 className="mb-3">Productos disponibles</h4>
      <table className="table table-hover table-bordered">
        <thead className="thead-light">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>Q{parseFloat(producto.precio_referencia).toFixed(2)}</td>
                <td>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() =>
                      onAdd({
                        id: producto.id,
                        name: producto.nombre,
                        price: parseFloat(producto.precio_referencia)
                      })
                    }
                  >
                    Agregar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoListSoloVista;
