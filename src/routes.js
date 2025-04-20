
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Dashboard from './Gasoline/Dashboard/Dashboard.js';
import DashboardPagos from "Payment/pages/DashboardPagos.js"; 

/* Iconos*/ 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";

const GasolineIcon = () => <FontAwesomeIcon icon={faGasPump} className="mr-2" />;
const PaymentIcon = () => <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-2" style={{ color: 'black', fontSize: '1rem' }}/>;

var routes = [
  {
    path: "/dashboard-pagos",
    name: "Dashboard Pagos",
    icon: <PaymentIcon />,
    component: <DashboardPagos />,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Gasoline Dashboard",
    icon: <GasolineIcon />,
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
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
