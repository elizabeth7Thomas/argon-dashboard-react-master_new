import React from "react";

function ProductCard({ producto, onAdd }) {
  const {
    nombre = "Sin nombre",
    precio = 0,
    imagen = "https://via.placeholder.com/100?text=Sin+Imagen",
  } = producto || {};

  return (
    <div
      style={{
        width: "140px",
        padding: "8px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
        margin: "8px",
        fontSize: "12px",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          overflow: "hidden",
          margin: "0 auto 8px auto",
        }}
      >
        <img
          src={imagen}
          alt={nombre}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{nombre}</div>
      <div style={{ color: "green", marginBottom: "6px" }}>
        Q{Number(precio).toFixed(2)}
      </div>
      <button
        onClick={() => onAdd && onAdd(producto)}
        style={{
          padding: "4px 8px",
          fontSize: "11px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Agregar
      </button>
    </div>
  );
}

export default ProductCard;
