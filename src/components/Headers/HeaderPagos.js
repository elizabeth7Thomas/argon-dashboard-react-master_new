import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Alert,
  Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCreditCard,
  faExchangeAlt,
  faCashRegister,
  faSync,
} from "@fortawesome/free-solid-svg-icons";

const formatCurrency = (amount = 0, currency = "GTQ") =>
  amount.toLocaleString("es-GT", { style: "currency", currency });

const MetricCard = ({ title, value, icon, color = "primary" }) => (
  <Col xl="3" md="6">
    <Card className="card-stats mb-4 mb-xl-0">
      <CardBody>
        <Row>
          <div className="col">
            <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
              {title}
            </CardTitle>
            <span className="h2 font-weight-bold mb-0">{value}</span>
          </div>
          <Col className="col-auto">
            <div
              className={`icon icon-shape bg-${color} text-white rounded-circle shadow`}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  </Col>
);

const HeaderPagos = () => {
  const [stats, setStats] = useState({
    transacciones: 0,
    facturacionTotal: 0,
    metodos: 0,
    totalCierresMonto: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchFacturas = async (token) => {
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/facturas/obtener" },
          request: {},
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      const facturas = response.data?.response?.data?.Facturas || [];

      return facturas.reduce(
        (sum, factura) => sum + parseFloat(factura.Total || 0),
        0
      );
    } catch (err) {
      console.error("Error al obtener facturas:", err);
      return 0;
    }
  };

  const fetchTotalCierres = async (token) => {
    try {
      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: { uri: "pagos/cierre/obtener" },
          request: {},
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      const cierres = response.data?.response?.data?.cierre || [];

      return cierres.reduce(
        (sum, cierre) => sum + parseFloat(cierre.TotalDia || 0),
        0
      );
    } catch (err) {
      console.error("Error al obtener cierres de caja:", err);
      return 0;
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación");

      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      };

      const [facturacionTotal, totalCierresMonto] = await Promise.all([
        fetchFacturas(token),
        fetchTotalCierres(token),
      ]);

      const [transaccionesRes, metodosRes] = await Promise.all([
        axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          { metadata: { uri: "pagos/transacciones/obtener" }, request: {} },
          axiosConfig
        ),
        axios.post(
          "http://64.23.169.22:3761/broker/api/rest",
          { metadata: { uri: "pagos/metodos/obtener" }, request: {} },
          axiosConfig
        ),
      ]);

      const transaccionesData =
        transaccionesRes.data?.response?.data?.transacciones ??
        transaccionesRes.data?.response?.data ??
        [];

      const metodosData =
        metodosRes.data?.response?.data?.metodos ??
        metodosRes.data?.response?.data ??
        [];

      setStats({
        transacciones: Array.isArray(transaccionesData)
          ? transaccionesData.length
          : 0,
        facturacionTotal,
        metodos: Array.isArray(metodosData) ? metodosData.length : 0,
        totalCierresMonto,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error al obtener estadísticas de pagos:", err);
      setError(
        err.message === "Network Error"
          ? "No se pudo conectar al servidor. Verifica tu conexión."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header bg-gradient-info pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Sistema de Pagos</h2>
              {lastUpdated && (
                <small className="text-white-50">
                  Última actualización: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
            </Col>
            <Col lg="6" className="text-right">
              <Button
                color="light"
                size="sm"
                onClick={fetchStats}
                disabled={loading}
              >
                <FontAwesomeIcon
                  icon={faSync}
                  spin={loading}
                  className="mr-2"
                />
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </Col>
          </Row>

          {error && (
            <Alert color="warning" className="mt-3">
              {error} - Mostrando datos almacenados.
            </Alert>
          )}

          <Row>
            <MetricCard
              title="Transacciones"
              value={stats.transacciones}
              icon={faExchangeAlt}
              color="success"
            />
            <MetricCard
              title="Facturación Total"
              value={formatCurrency(stats.facturacionTotal, "GTQ")}
              icon={faMoneyBillWave}
              color="danger"
            />
            <MetricCard
              title="Métodos de Pago"
              value={stats.metodos}
              icon={faCreditCard}
              color="info"
            />
            <MetricCard
              title="Total Cierres Caja"
              value={formatCurrency(stats.totalCierresMonto, "GTQ")}
              icon={faCashRegister}
              color="warning"
            />
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HeaderPagos;
