// components/BancoForm.js
import React, { useState } from "react";

const BancoForm = ({ onBancoCreado }) => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("http://localhost:3001/pagos/bancos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ " + data.mensaje);
        setNombre("");
        onBancoCreado(); // actualiza la lista
      } else {
        setMensaje("❌ " + data.mensaje);
      }
    } catch (error) {
      setMensaje("❌ Error de red al crear el banco");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Agregar nuevo banco</h2>
      <input
        type="text"
        placeholder="Nombre del banco"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Banco
      </button>
      {mensaje && (
        <p className={`mt-2 text-sm ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </p>
      )}
    </form>
  );
};

export default BancoForm;
