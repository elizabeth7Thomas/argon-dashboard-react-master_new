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
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

/*IMPORTACIONES GASOLINA*/
import Alerts from "Gasoline/Alerts/Alerts";
import Deposits from "Gasoline/Deposits/Deposits";
import GasolineType from "Gasoline/GasolineTypes/GasolineTypes";
import PumpStatus from "Gasoline/PumpStatus/PumpStatus";
import Sales from "Gasoline/Sales/Sales";
import SalesCart from "Gasoline/SalesCart/SalesCart";
import Pinturas from "views/examples/TallerPinturas";
/*IMPORTACIONES PAGOS */
import DashboardPagos from "Payment/pages/DashboardPagos";


import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
/*IMPORTACION DE TALLER PINTURA */
import TallerPinturaLayout from "layouts/TallerPintura.js";
import ClientesPage from "Payment/pages/ClientesPage";

import TablaServicios from "components/TallerPintura/Tables/TablaServicios";
import TablaDevoluciones from "components/TallerPintura/Tables/TablaDevoluciones";
import TablaTipoPinturas from "components/TallerPintura/Tables/TablaTipoPinturas";
import TablaTiposServicios from "components/TallerPintura/Tables/TablaTiposServicios";
import TablaTiposVehiculos from "components/TallerPintura/Tables/TablaTiposVehiculos";
import TablaInventarios from "components/TallerPintura/Tables/TablaInventarios";
import TablaVentas from "components/TallerPintura/Tables/TablaVentas";
import TablaPrecioServicio from "components/TallerPintura/Tables/TablaPrecioServicio";
import TablaInventarioVehiculos from "components/TallerPintura/Tables/TablaInventarioVehiculos";

/*IMPORTACION DE ADMINISTRACION */
import Administracion from "layouts/Administracion.js";

/* IMPORTACION TALLER MANTENIMIENTO*/
import VehiculosMantenimiento from "TallerMantenimiento/VehiculosMantenimiento/VehiculosMantenimiento";
import InventarioMantenimiento from "TallerMantenimiento/InventarioMantenimiento/InventarioMantenimiento";

/*IMPORTACIONES TIENDA CONVENIENCIA*/
import ProveedoresTienda from "TiendaConveniencia/ProveedoresTienda/ProveedoresTienda";
import ReportesTienda from "TiendaConveniencia/ReportesTienda/ReportesTienda";
import Inventario from "TiendaConveniencia/InventarioTienda/Inventario.js";
import Clientes from "TallerMantenimiento/Clientes";
import Reports from "views/examples/Reports";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/tallerPintura/*" element={<TallerPinturaLayout />} />
      <Route path="/administracion/*" element={<Administracion />} />


      <Route path="*" element={<Navigate to="/admin/index" replace />} />

      {/*TALLER PINTURAS ROUTS*/}
      <Route path="/admin/servicios" element={<TablaServicios />} />
      <Route path="/admin/devoluciones" element={<TablaDevoluciones />} />
      <Route path="/admin/tipos-Pintura" element={<TablaTipoPinturas />} />
      <Route path="/admin/tipos-Servicios" element={<TablaTiposServicios />} />
      <Route path="/admin/tipos-Vehiculos" element={<TablaTiposVehiculos />} />
      <Route path="/admin/inventarios" element={<TablaInventarios />} />
      <Route path="/admin/ventas" element={<TablaVentas />} />
      <Route path="/admin/precio-Servicio" element={<TablaPrecioServicio />} />
      <Route path="/admin/inventario-Vehiculos" element={<TablaInventarioVehiculos />} />
      {/*GASOLINE ROUTS*/}

      <Route path="/admin/gasoline/alerts" element={<Alerts />} />
      <Route path="/admin/gasoline/deposits" element={<Deposits />} />
      <Route path="/admin/gasoline/gasoline-types" element={<GasolineType />} />
      <Route path="/admin/gasoline/pump-status" element={<PumpStatus />} />
      <Route path="/admin/gasoline/sales" element={<Sales />} />
      <Route path="/admin/gasoline/sales-cart" element={<SalesCart />} />

      {/*PAYMENTS ROUTS*/}

      <Route path="/admin/payments/dashboard" element={<DashboardPagos />} />
      <Route path="/admin/payment/clientes" element={<ClientesPage />} />

      {/*TALLER ROUTES*/}
      <Route path="/admin/taller-pinturas" element={<Pinturas />} />

      {/* TALLER MANTENIMIENTO ROUTES*/}
      <Route path="/admin/vehiculosMantenimiento" element={<VehiculosMantenimiento />} />
      <Route path="/admin/inventarioMantenimiento" element={<InventarioMantenimiento />} />

      {/*TIENDA CONVENIENCIA ROUTES*/}
      <Route path = "/admin/clientesMantenimiento" element = {<Clientes />} />
      <Route path = "/admin/inventario" element = {<Inventario />} />
      <Route path = "/admin/proveedoresTienda" element = {<ProveedoresTienda />} />
      <Route path = "/admin/reportesTienda" element = {<ReportesTienda />} />

      {/* Add more routes as needed */}+
      <Route path="/admin/reports" element={<Reports />} />


    </Routes>
  </BrowserRouter>
);
