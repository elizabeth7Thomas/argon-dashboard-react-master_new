import React from "react";

function ProductCard({ product, onAdd }) {
  const {
    name = "Sin nombre",
    price = 0,
    image = "https://via.placeholder.com/100?text=Sin+Imagen",
  } = product || {};

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
          src={image}
          alt={name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{name}</div>
      <div style={{ color: "green", marginBottom: "6px" }}>
        Q{Number(price).toFixed(2)}
      </div>
      <button
        onClick={() => onAdd(product)}
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
