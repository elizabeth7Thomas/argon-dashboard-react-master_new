import React from 'react';

const TransaccionForm = () => {
  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrar Transacción</h2>

      <form className="space-y-4">
        <div>
          <label htmlFor="nombreCliente" className="block text-sm font-medium text-gray-700">
            Nombre del Cliente
          </label>
          <input
            type="text"
            id="nombreCliente"
            name="nombreCliente"
            placeholder="Ingrese el nombre del cliente"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="nit" className="block text-sm font-medium text-gray-700">
            NIT
          </label>
          <input
            type="text"
            id="nit"
            name="nit"
            placeholder="Ingrese el NIT"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700">
            Método de Pago
          </label>
          <select
            id="metodoPago"
            name="metodoPago"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Guardar Transacción
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransaccionForm;
