
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Dashboard from './Gasoline/Dashboard/Dashboard.js';
import DashboardPagos from "Payment/pages/DashboardPagos.js"; 
import Pinturas from "views/examples/TallerPinturas.js";
import Alerts from "Gasoline/Alerts/Alerts.js";import Administracion from "views/examples/Administracion.js";

/* Iconos*/ 

var routes = [
  {
    path: "/dashboard-pagos",
    name: "Dashboard Pagos",
    icon: "ni ni-money-coins",
    component: <DashboardPagos />,
    layout: "/admin",
  },
  {
    path: "/alerts",
    name: "Alertas",
    component: <Alerts />,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/dashboard",
    name: "Gasoline Dashboard",
    icon: "ni ni-delivery-fast",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Iniciar Sesion",
    icon: "ni ni-single-02",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Craer Cuenta",
    icon: "ni ni-circle-08",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/Pinturas",
    name: "Taller de pintura",
    icon: "ni ni-palette",
    component: <Pinturas/>,
    layout: "/tallerPintura",
  },
  {
    path: "/administracion",
    name: "Administración",
    icon: "ni ni-badge",
    component: <Administracion/>,
    layout: "/admin",
  }

];
export default routes;
