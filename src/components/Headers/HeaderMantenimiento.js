// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";

const BASE_URL = "https://tallerrepuestos.vercel.app/tallerrepuestos";

const HeaderMantenimiento = () => {
  const navigate = useNavigate();

  // Estados para contar clientes y productos
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);

  useEffect(() => {
    // Obtener número de clientes
    axios
      .get(`${BASE_URL}/clientes`)
      .then((res) => setClientesCount(res.data.length))
      .catch(() => setClientesCount(0));
    // Obtener número de productos
    axios
      .get(`${BASE_URL}/productos`)
      .then((res) => setProductosCount(res.data.length))
      .catch(() => setProductosCount(0));
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-6 pt-5">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/clientes")}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Clientes
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {clientesCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="ni ni-single-02" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/productos")}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Productos
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {productosCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="ni ni-box-2" />
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
    </>
  );
};

export default HeaderMantenimiento;
