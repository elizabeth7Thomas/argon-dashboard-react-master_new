// Tienda.js
import React, { useState, useEffect } from "react";
import ProductList from "./ProductList";
import HeaderTienda from "components/Headers/HeaderTienda";
import CarritoPanel from "./CarritoPanel";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
 
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Badge
} from "reactstrap";
import classnames from "classnames";
import { 
  faSearch, 
  faTh, 
  faList,
  faFilter,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Tienda() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [categories, setCategories] = useState(["Todas"]);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/inventario");
        setProducts(res.data);
        
        // Extraer categorías únicas
        const uniqueCategories = ["Todas", ...new Set(res.data.map(p => p.categoria))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error al obtener productos del inventario:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos
  useEffect(() => {
    let result = products;
    
    // Filtrar por categoría
    if (selectedCategory !== "Todas") {
      result = result.filter(p => p.categoria === selectedCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.descripcion.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm]);

  const handleAddProduct = (product) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <HeaderTienda />
      <Container className="mt--7" fluid>
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody>
                <Row className="align-items-center">
                  <Col md="6" className="mb-3 mb-md-0">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faSearch} />
                        </span>
                      </div>
                      <Input
                        placeholder="Buscar productos..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faFilter} className="mr-2" />
                      <select 
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                      Productos Disponibles
                      <Badge color="primary" className="ml-2">
                        {filteredProducts.length}
                      </Badge>
                    </h3>
                  </Col>
                  <Col className="text-right">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => toggleTab("1")}
                        >
                          <FontAwesomeIcon icon={faTh} /> Galería
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => toggleTab("2")}
                        >
                          <FontAwesomeIcon icon={faList} /> Lista
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <ProductList 
                      products={filteredProducts} 
                      onAdd={handleAddProduct}
                      viewMode="grid"
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <ProductList 
                      products={filteredProducts} 
                      onAdd={handleAddProduct}
                      viewMode="list"
                    />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <CarritoPanel cart={cart} setCart={setCart} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Tienda;