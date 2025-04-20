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

/*IMPORTACIONES PAGOS */
import DashboardPagos from "Payment/pages/DashboardPagos";


import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import TallerPinturaLayout from "layouts/TallerPintura.js";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/tallerPintura/*" element={<TallerPinturaLayout />} />
      <Route path="*" element={<Navigate to="/admin/index" replace />} />

      {/*GASOLINE ROUTS*/}

      <Route path="/admin/gasoline/alerts" element={<Alerts />} />
      <Route path="/admin/gasoline/deposits" element={<Deposits />} />
      <Route path="/admin/gasoline/gasoline-types" element={<GasolineType />} />
      <Route path="/admin/gasoline/pump-status" element={<PumpStatus />} />
      <Route path="/admin/gasoline/sales" element={<Sales />} />
      <Route path="/admin/gasoline/sales-cart" element={<SalesCart />} />

      {/*PAYMENTS ROUTS*/}

      <Route path="/admin/payments/dashboard" element={<DashboardPagos />} />

    </Routes>
  </BrowserRouter>
);
