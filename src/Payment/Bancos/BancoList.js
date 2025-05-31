// components/BancoList.js
import React, { useEffect, useState } from "react";

const BancoList = () => {
  const [bancos, setBancos] = useState([]);

  const cargarBancos = async () => {
    try {
      const res = await fetch("http://localhost:3001/pagos/bancos");
      const data = await res.json();
      setBancos(data);
    } catch (err) {
      console.error("Error al cargar los bancos:", err);
    }
  };

  useEffect(() => {
    cargarBancos();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Lista de Bancos</h2>
      <ul className="list-disc pl-4">
        {bancos.map((banco) => (
          <li key={banco._id}>{banco.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default BancoList;
