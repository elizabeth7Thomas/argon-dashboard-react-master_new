import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Badge
} from 'reactstrap';
import Header from "../../components/Headers/HeaderPagos";
import {
  faUser,
  faCreditCard,
  faMoneyBill,
  faUndoAlt,
  faUniversity,
  faFileInvoice,
  faCashRegister,
  faHandHoldingUsd
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clienteService from '../services/clienteService';
import metodoPagoService from '../services/metodoPagoService';
import transaccionService from '../services/transaccionService';
import devolucionService from '../services/devolucionService';
import bancoService from '../services/bancoService';
import facturaService from '../services/facturaService';
import cierreCajaService from '../services/cierreCajaService';

export default function DashboardPagos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const [clientes, metodos, transacciones, devoluciones, bancos, facturas, cierres] = await Promise.all([
          clienteService.count(),
          metodoPagoService.count(),
          transaccionService.count(),
          devolucionService.count(),
          bancoService.count(),
          facturaService.count(),
          cierreCajaService.count()
        ]);

        setStats({
          clientes,
          metodos,
          transacciones,
          devoluciones,
          bancos,
          facturas,
          cierres
        });
        setLoading(false);
      } catch (error) {
        console.error("Error cargando estadísticas del dashboard", error);
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-5" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button color="info" onClick={() => navigate('/admin/payment/clientes')} className="btn-icon">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Clientes
                  <Badge color="light" className="ml-2">{stats.clientes}</Badge>
                </Button>
                <Button color="primary" onClick={() => navigate('/admin/metodos-pago')} className="btn-icon">
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Métodos de Pago
                  <Badge color="light" className="ml-2">{stats.metodos}</Badge>
                </Button>
                <Button color="success" onClick={() => navigate('/admin/transacciones')} className="btn-icon">
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" /> Transacciones
                  <Badge color="light" className="ml-2">{stats.transacciones}</Badge>
                </Button>
                <Button color="warning" onClick={() => navigate('/admin/devoluciones')} className="btn-icon">
                  <FontAwesomeIcon icon={faUndoAlt} className="mr-2" /> Devoluciones
                  <Badge color="light" className="ml-2">{stats.devoluciones}</Badge>
                </Button>
                <Button color="secondary" onClick={() => navigate('/admin/bancos')} className="btn-icon">
                  <FontAwesomeIcon icon={faUniversity} className="mr-2" /> Bancos
                  <Badge color="light" className="ml-2">{stats.bancos}</Badge>
                </Button>
                <Button color="danger" onClick={() => navigate('/admin/facturas')} className="btn-icon">
                  <FontAwesomeIcon icon={faFileInvoice} className="mr-2" /> Facturas
                  <Badge color="light" className="ml-2">{stats.facturas}</Badge>
                </Button>
                <Button color="dark" onClick={() => navigate('/admin/cierre-caja')} className="btn-icon">
                  <FontAwesomeIcon icon={faCashRegister} className="mr-2" /> Cierre de Caja
                  <Badge color="light" className="ml-2">{stats.cierres}</Badge>
                </Button>
                <Button color="purple" onClick={() => navigate('/admin/retiro-caja')} className="btn-icon">
                  <FontAwesomeIcon icon={faHandHoldingUsd} className="mr-2" /> Retiro de Caja
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  Resumen general del sistema de pagos
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-0">
                  Este panel resume las estadísticas actuales del sistema de pagos. Los botones superiores permiten el acceso directo a cada módulo para su gestión.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}