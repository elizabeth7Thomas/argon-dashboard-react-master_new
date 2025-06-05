import { useEffect, useState } from 'react';
import axios from 'axios';

export const useProductos = () => {
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

      const data = response.data?.response?.data;

      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        console.warn(' La respuesta no contiene un array válido de productos:', data);
        setProductos([]);
      }
    } catch (error) {
      console.error(' Error al obtener productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos,
    loading,
    refetch: fetchProductos // Útil si necesitas recargar después de crear un producto
  };
};
