//routes.js
import Index from "views/Index.js";
import Login from "views/examples/Login.js";
import Dashboard from './Gasoline/Dashboard/Dashboard.js';
import DashboardPagos from "Payment/pages/DashboardPagos.js"; 
import Pinturas from "views/examples/TallerPinturas.js";
import Alerts from "Gasoline/pages/PageAlertsGasoline.js";
import DashboardAdmin from "Admin/Pages/DashboardAdmin.js";
import Reports from "views/examples/Reports.js";
import Tienda from "TiendaConveniencia/Tienda.js";
import Mantenimiento from "TallerMantenimiento/Mantenimiento.js";

/* Iconos mejor organizados y títulos claros */

const routes = [
  // DASHBOARDS
  {
    path: "/index",
    name: "Dashboard Principal",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard Gasolina",
    icon: "ni ni-delivery-fast text-orange",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/dashboard-pagos",
    name: "Dashboard Pagos",
    icon: "ni ni-money-coins text-green",
    component: <DashboardPagos />,
    layout: "/admin",
  },

  // MÓDULOS PRINCIPALES
  {
    path: "/tienda",
    name: "Tienda de Conveniencia",
    icon: "ni ni-shop text-info",
    component: <Tienda />,
    layout: "/admin",
  },
  {
    path: "/taller-pintura",
    name: "Taller de Pintura",
    icon: "ni ni-palette text-warning",
    component: <Pinturas />,
    layout: "/admin",
  },
  {
    path: "/mantenimiento",
    name: "Taller de Mantenimiento",
    icon: "ni ni-settings text-purple",
    component: <Mantenimiento />,
    layout: "/admin",
  },
  {
    path: "/administracion",
    name: "Administración",
    icon: "ni ni-badge text-blue",
    component: <DashboardAdmin />,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Sistema de Reportes",
    icon: "ni ni-collection text-yellow",
    component: <Reports />,
    layout: "/admin",
  },

  // ALERTAS
  {
    path: "/alerts",
    name: "Alertas del Sistema",
    icon: "ni ni-bell-55 text-danger",
    component: <Alerts />,
    layout: "/admin",
    hidden: true, // visible solo desde otras partes
  },
  

  // AUTENTICACIÓN
  {
    path: "/login",
    name: "Iniciar Sesión",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },

];

export default routes;
