import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import DashboardPagos from './pages/DashboardPagos';

import ClientesPage from './pages/ClientesPage';
import MetodosPagoPage from './pages/MetodosPagoPage';
import TransaccionesPage from './pages/TransaccionesPage';
import DevolucionesPage from './pages/DevolucionesPage';
import BancosPage from './pages/BancosPage';
import FacturasPage from './pages/FacturasPage';
import CierreCajaPage from './pages/CierreCajaPage';

import RetiroCajaForm from './routes/RetiroCaja/RetiroCajaForm';

const PagosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/payments/dashboard" element={<DashboardPagos />} />
      <Route path="/admin/payment/clientes" element={<ClientesPage />} />
      <Route path="/admin/metodos-pago" element={<MetodosPagoPage />} />
      <Route path="/admin/transacciones" element={<TransaccionesPage />} />
      <Route path="/admin/devoluciones" element={<DevolucionesPage />} />
      <Route path="/admin/bancos" element={<BancosPage />} />
      <Route path="/admin/facturas" element={<FacturasPage />} />
      <Route path="/admin/cierre-caja" element={<CierreCajaPage />} />
      <Route path="/admin/retiro-caja" element={<RetiroCajaForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PagosRoutes;