// /src/Gasoline/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GasolineTypes from './GasolineTypes/GasolineTypes';
import SalesCart from './Sales/SalesCart/SalesCart';
import Sales from './Sales/Sales';
import Deposits from './Deposits/Deposits';
import PumpStatus from './PumpStatus/PumpStatus';
import Alerts from './Alerts/Alerts';
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
