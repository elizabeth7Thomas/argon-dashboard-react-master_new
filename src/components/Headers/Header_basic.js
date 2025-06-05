import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import axios from "axios";
import moment from "moment";

const Header_basic = () => {
  const [stats, setStats] = useState({
    bombasActivas: 0,
    bombasTotales: 0,
    totalVentasHoy: 0,
    galonesVendidosHoy: 0,
    totalCombustibleDisponible: 0
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const [bombsRes, activeBombsRes, salesRes, depositRes] = await Promise.all([
        axios.post("http://64.23.169.22:3761/broker/api/rest", {
          metadata: { uri: "/bomb/list" },
          request: {}
        }, { headers }),
        axios.post("http://64.23.169.22:3761/broker/api/rest", {
          metadata: { uri: "/bomb/list/active" },
          request: {}
        }, { headers }),
        axios.post("http://64.23.169.22:3761/broker/api/rest", {
          metadata: { uri: "/sale/list" },
          request: {}
        }, { headers }),
        axios.post("http://64.23.169.22:3761/broker/api/rest", {
          metadata: { uri: "/generalDeposit/list" },
          request: {}
        }, { headers })
      ]);

      const totalBombs = bombsRes.data.response.bomb?.length || 0;
      const activeBombs = activeBombsRes.data.response.bomb?.length || 0;

      const today = moment().startOf("day");
      const ventasHoy = salesRes.data.response.filter(v => moment(v.createdAt).isSame(today, "day"));

      const totalVentasHoy = ventasHoy.reduce((sum, venta) => sum + (venta.amount || 0), 0);
      const galonesHoy = ventasHoy.reduce((sum, venta) => sum + (venta.consumedQuantity || 0), 0);

      const totalCombustible = depositRes.data.response["general-deposit"]
        ?.reduce((sum, dep) => sum + (dep.currentCapacity || 0), 0) || 0;

      setStats({
        bombasActivas: activeBombs,
        bombasTotales: totalBombs,
        totalVentasHoy,
        galonesVendidosHoy: galonesHoy,
        totalCombustibleDisponible: totalCombustible
      });

    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="header bg-gradient-info pb-6 pt-5">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col lg="6">
              <h2 className="text-white mb-0">Panel de Control</h2>
            </Col>
          </Row>

          <Row>
            <Col lg="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Bombas Activas
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats.bombasActivas}/{stats.bombasTotales}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-gas-pump" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Ventas Hoy
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        ${stats.totalVentasHoy.toFixed(2)}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-dollar-sign" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Galones Vendidos Hoy
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats.galonesVendidosHoy.toFixed(2)} gal
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-oil-can" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Combustible Disponible
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats.totalCombustibleDisponible.toFixed(2)} gal
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-tachometer-alt" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header_basic;
