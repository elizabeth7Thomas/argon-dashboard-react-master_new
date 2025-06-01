// /src/Gasoline/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GasolineTypes from './page/PageGasolineTypes';
import SalesCart from './pages/PageSalesCartGasoline';
import Sales from './page/PageSalesGasoline';
import Deposits from './pages/PageDepositsGasoline';
import PumpStatus from './pages/PagePumpStatusGasoline';
import Alerts from './pages/PageAlertsGasoline';
import Dashboard from './Dashboard/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/gasoline-types" element={<GasolineTypes />} />
      <Route path="/admin/sales-cart" element={<SalesCart />} />
      <Route path="/admin/sales" element={<Sales />} />
      <Route path="/admin/deposits" element={<Deposits />} />
      <Route path="/admin/pump-status" element={<PumpStatus />} />
      <Route path="/admin/alerts" element={<Alerts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
