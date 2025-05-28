import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classnames from "classnames";
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
  Badge,
  Progress,
  ListGroup,
  ListGroupItem
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
  faHandHoldingUsd,
  faChartLine,
  faExchangeAlt,
  faReceipt,
  faWallet
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
  const [transactionSummary, setTransactionSummary] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          clientes, 
          metodos, 
          transacciones, 
          devoluciones, 
          bancos, 
          facturas, 
          cierres,
          summary,
          recent
        ] = await Promise.all([
          clienteService.count(),
          metodoPagoService.count(),
          transaccionService.count(),
          devolucionService.count(),
          bancoService.count(),
          facturaService.count(),
          cierreCajaService.count(),
          transaccionService.getSummary(),
          transaccionService.getRecent(5)
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

        setTransactionSummary(summary);
        setRecentTransactions(recent);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos del dashboard", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center py-5">
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
        <h4 className="mt-3">Cargando datos del sistema...</h4>
      </Container>
    );
  }

  return (
    <>
      <Header stats={stats} />
      <Container className="mt-5" fluid>
        {/* Navegación principal */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button 
                  color="info" 
                  onClick={() => navigate('/admin/payment/clientes')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> 
                  Clientes
                  <Badge color="light" className="ml-2">{stats.clientes}</Badge>
                </Button>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/admin/payment/metodos')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> 
                  Métodos
                  <Badge color="light" className="ml-2">{stats.metodos}</Badge>
                </Button>
                <Button 
                  color="success" 
                  onClick={() => navigate('/admin/payment/transacciones')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" /> 
                  Transacciones
                  <Badge color="light" className="ml-2">{stats.transacciones}</Badge>
                </Button>
                <Button 
                  color="warning" 
                  onClick={() => navigate('/admin/devoluciones')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUndoAlt} className="mr-2" /> 
                  Devoluciones
                  <Badge color="light" className="ml-2">{stats.devoluciones}</Badge>
                </Button>
                <Button 
                  color="secondary" 
                  onClick={() => navigate('/admin/bancos')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUniversity} className="mr-2" /> 
                  Bancos
                  <Badge color="light" className="ml-2">{stats.bancos}</Badge>
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => navigate('/admin/facturas')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faReceipt} className="mr-2" /> 
                  Facturas
                  <Badge color="light" className="ml-2">{stats.facturas}</Badge>
                </Button>
                <Button 
                  color="dark" 
                  onClick={() => navigate('/admin/cierre-caja')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faCashRegister} className="mr-2" /> 
                  Cierres
                  <Badge color="light" className="ml-2">{stats.cierres}</Badge>
                </Button>
                <Button 
                  color="purple" 
                  onClick={() => navigate('/admin/retiro-caja')} 
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faWallet} className="mr-2" /> 
                  Retiros
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Estadísticas principales */}
        <Row>
          {/* Resumen de transacciones */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Resumen de Transacciones
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  {transactionSummary.map((item, index) => (
                    <ListGroupItem key={index} className="py-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="font-weight-bold">{item.method}</span>
                        <small>${item.amount.toLocaleString()}</small>
                      </div>
                      <Progress
                        value={item.percentage}
                        color={index % 2 === 0 ? "success" : "info"}
                        className="progress-xs"
                      />
                      <small className="text-muted d-block text-right">
                        {item.count} transacciones ({item.percentage}%)
                      </small>
                    </ListGroupItem>
                  ))}
                </ListGroup>
                <Button 
                  color="success" 
                  outline 
                  block 
                  className="mt-3"
                  onClick={() => navigate('/admin/transacciones')}
                >
                  Ver todas las transacciones
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* Transacciones recientes */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                  Transacciones Recientes
                </CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <ListGroup flush>
                  {recentTransactions.map((txn, index) => (
                    <ListGroupItem
                      key={index}
                      className={classnames("py-3 px-4", {
                        "bg-success text-white": txn.status === "completed",
                        "bg-warning": txn.status === "pending",
                        "bg-danger text-white": txn.status === "failed"
                      })}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Badge color="light" className="mr-2">
                            #{txn.reference}
                          </Badge>
                          <span>{txn.description}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-weight-bold">${txn.amount}</div>
                          <small>{txn.method}</small>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>

          {/* Estadísticas generales */}
          <Col lg="4" className="mb-4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
                  Estadísticas Generales
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    <span className="font-weight-bold">Clientes registrados</span>
                    <Badge color="info" pill>{stats.clientes}</Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    <span className="font-weight-bold">Métodos de pago</span>
                    <Badge color="primary" pill>{stats.metodos}</Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    <span className="font-weight-bold">Transacciones hoy</span>
                    <Badge color="success" pill>{stats.transacciones}</Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    <span className="font-weight-bold">Devoluciones</span>
                    <Badge color="warning" pill>{stats.devoluciones}</Badge>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center py-3">
                    <span className="font-weight-bold">Facturas emitidas</span>
                    <Badge color="danger" pill>{stats.facturas}</Badge>
                  </ListGroupItem>
                </ListGroup>
                <Button 
                  color="primary" 
                  outline 
                  block 
                  className="mt-3"
                  onClick={() => navigate('/admin/cierre-caja')}
                >
                  Realizar cierre de caja
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Acciones rápidas */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <CardTitle tag="h5" className="mb-0">
                  <FontAwesomeIcon icon={faHandHoldingUsd} className="mr-2" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardBody className="d-flex flex-wrap gap-3 justify-content-center">
                <Button 
                  color="success" 
                  onClick={() => navigate('/admin/transacciones/nueva')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                  Nueva Transacción
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => navigate('/admin/facturas/nueva')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
                  Crear Factura
                </Button>
                <Button 
                  color="warning" 
                  onClick={() => navigate('/admin/devoluciones/nueva')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faUndoAlt} className="mr-2" />
                  Registrar Devolución
                </Button>
                <Button 
                  color="info" 
                  onClick={() => navigate('/admin/retiro-caja/nuevo')}
                  className="btn-icon"
                >
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  Retiro de Caja
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}