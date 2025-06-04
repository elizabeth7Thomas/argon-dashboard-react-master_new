import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Spinner, Badge
} from 'reactstrap';
import axios from 'axios';
import Header from 'components/Headers/Header_alerta'; // o Header_venta si tienes uno específico
import SaleList from '../Sales/SaleList';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token de autenticación no encontrado");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          {
            metadata: { uri: "sale/list" },
            request: {}
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const salesData = response.data?.response?.data;

        if (Array.isArray(salesData)) {
          const parsed = salesData.map((sale) => ({
            id: sale.fuelSaleId,
            producto: sale.fuel?.fuelName || 'Desconocido',
            cantidad: sale.consumedQuantity ?? 0,
            fecha: sale.createdAt ? new Date(sale.createdAt).toLocaleString() : 'Sin fecha',
            monto: sale.amount ?? 0,
            status: sale.status,
            cliente: sale.customer?.customerName || 'N/A',
            bomba: sale.bomb?.bombNumber || '-'
          }));

          setSales(parsed);
        } else {
          setError("Respuesta inválida del broker");
        }
      } catch (err) {
        console.error("Error al obtener ventas:", err);
        setError("Error al conectar con el broker");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleEdit = (sale) => {
    alert("Editar venta no implementado aún: " + sale.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar esta venta?")) {
      // Por ahora, solo lo quitamos del estado local
      setSales(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <>
      <Container className="py-4" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Registro de Ventas</h3>
                <Badge color="primary" pill>Live</Badge>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <Spinner color="primary" />
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <SaleList
                    sales={sales}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
