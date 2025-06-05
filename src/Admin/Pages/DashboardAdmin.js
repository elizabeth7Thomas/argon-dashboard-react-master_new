// src/Administracion/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
} from 'reactstrap';
import HeaderAdministracion from "components/Headers/HeaderAdministracion";
import { 
  faUsers, 
  faBell, 
  faSitemap, 
  faUserTag, 
  faTruck, 
  faCogs,
  faBusinessTime,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

// Importa tus componentes de tablas reales
import EmpleadosPage from './PageEmpleadosAdmin';
import AlertasPage from './PageAlertasAdmin';
import AreasPage from './PageAreasAdmin';
import RolesPage from './PageRolesAdmin';
import ProveedoresPage from './PageProveedoresAdmin';
import ServiciosPage from './PageServiciosAdmin';
import JornadasPage from './PageJornadasAdmin';
import MovimientosPage from './PageMovimientosAdmin';
import Ordenes from './PageOrdenesAdmin';

export default function DashboardAdmin() {

  // Estado para la sección seleccionada
  const [selectedSection, setSelectedSection] = useState(null);

  // Efecto para cargar catálogos al montar el componente
  useEffect(() => {
    const fetchCatalogos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const catalogos = [
        { key: "areas", uri: "administracion/GET/areas" },
        { key: "roles", uri: "administracion/GET/roles" },
        { key: "jornadas", uri: "administracion/GET/jornadas" },
        { key: "servicios", uri: "administracion/GET/servicios" },
        { key: "proveedores", uri: "administracion/GET/proveedores" },
        // Agrega más si lo necesitas
      ];

      for (const cat of catalogos) {
        try {
          const response = await axios.post(
            "http://64.23.169.22:3761/broker/api/rest",
            {
              metadata: { uri: cat.uri },
              request: {},
            },
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            }
          );
          // Busca el array de datos según la estructura de cada respuesta
          let items = [];
          if (response.data?.response?.data?.[cat.key] && Array.isArray(response.data.response.data[cat.key])) {
            items = response.data.response.data[cat.key];
          } else if (response.data?.response?.data?.data && Array.isArray(response.data.response.data.data)) {
            items = response.data.response.data.data;
          } else if (Array.isArray(response.data?.response?.data)) {
            items = response.data.response.data;
          }
          localStorage.setItem(`catalogo_${cat.key}`, JSON.stringify(items));
        } catch (err) {
          console.error(`Error al obtener ${cat.key}:`, err);
        }
      }
    };

    fetchCatalogos();
  }, []);

  // Render dinámico del componente según la sección seleccionada
  const renderSection = () => {
    switch (selectedSection) {
      case 'empleados':
        return <EmpleadosPage />;
      case 'alertas':
        return <AlertasPage />;
      case 'areas':
        return <AreasPage />;
      case 'roles':
        return <RolesPage />;
      case 'proveedores':
        return <ProveedoresPage />;
      case 'servicios':
        return <ServiciosPage />;
      case 'jornadas':
        return <JornadasPage />;
      case 'movimientos':
        return <MovimientosPage />;
      case 'ordenes':
        return <Ordenes />;
      default:
        return <p className="text-muted">Selecciona una opción para comenzar.</p>;
    }
  };

  return (
    <>
      <HeaderAdministracion />
      <Container className="mt-4" fluid>
        {/* Navegación principal */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody className="d-flex flex-wrap gap-2 justify-content-center">
                <Button color="primary" onClick={() => setSelectedSection('empleados')} className="btn-icon">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Empleados
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('alertas')} className="btn-icon">
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Alertas
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('areas')} className="btn-icon">
                  <FontAwesomeIcon icon={faSitemap} className="mr-2" />
                  Áreas
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('roles')} className="btn-icon">
                  <FontAwesomeIcon icon={faUserTag} className="mr-2" />
                  Roles
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('proveedores')} className="btn-icon">
                  <FontAwesomeIcon icon={faTruck} className="mr-2" />
                  Proveedores
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('servicios')} className="btn-icon">
                  <FontAwesomeIcon icon={faCogs} className="mr-2" />
                  Servicios
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('jornadas')} className="btn-icon">
                  <FontAwesomeIcon icon={faBusinessTime} className="mr-2" />
                  Jornadas
                </Button>
                <Button color="primary" onClick={() => setSelectedSection('movimientos')} className="btn-icon">
                  <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                  Movimientos
                </Button>
                {/* El botón de Órdenes ha sido removido de aquí */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Contenedor del componente dinámico */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Formulario</h3>
              </CardHeader>
              <CardBody>
                {renderSection()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}