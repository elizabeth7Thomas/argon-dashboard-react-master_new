import React from "react";
import ProductCard from "./ProductCard";

function ProductList({ products, onAdd }) {
  return (
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
      {products.map(product => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default ProductList;
