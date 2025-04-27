/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://www.umes.edu.gt/"
                  target="_blank"
                >
                  Umes
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink
                    href="https://www.umes.edu.gt/"
                    target="_blank"
                  >
                    Umes
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://www.umes.edu.gt/nosotros"
                    target="_blank"
                  >
                    Nosotros
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://www.umes.edu.gt/ingenier%C3%ADa-en-sistemas-quetzaltenango"
                    target="_blank"
                  >
                    Ingenieria en Sistemas
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://www.umes.edu.gt/rese%C3%B1a-de-don-bosco"
                    target="_blank"
                  >
                    Don Bosco 
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
