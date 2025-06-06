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
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="https://www.umes.edu.gt/"
              rel="noopener noreferrer"
              target="_blank"
            >
              UmeStation
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                href="https://www.umes.edu.gt/nosotros"
                rel="noopener noreferrer"
                target="_blank"
              >
                Nosotros
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.umes.edu.gt/facultad-de-ingenieria"
                rel="noopener noreferrer"
                target="_blank"
              >
                Facultad de Ingenieria
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.umes.edu.gt/academico"
                rel="noopener noreferrer"
                target="_blank"
              >
                Academico
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.umes.edu.gt/rese%C3%B1a-de-don-bosco"
                rel="noopener noreferrer"
                target="_blank"
              >
                Don Bosco
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
