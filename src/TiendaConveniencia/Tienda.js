import React, { useState, useEffect } from "react";
import HeaderTienda from "components/Headers/HeaderTienda";
import CarritoPanel from "./CarritoPanel";
import axios from "axios";
import ProductListSoloVista from "./InventarioTienda/List/ProductListSoloVista";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/inventario");

        const mappedProducts = res.data.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          categoria: p.categoria,
          precio_referencia: p.precio,
          imagen: p.imagen
        }));

        setProducts(mappedProducts);

        const uniqueCategories = ["Todas", ...new Set(mappedProducts.map((p) => p.categoria))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error al obtener productos del inventario:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== "Todas") {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(term) ||
          p.descripcion.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

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

  return (
    <>
      <HeaderTienda />
      <br />
      <br />
      <br />
      <br />
      <br />
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
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
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
                     
                    </Nav>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <ProductListSoloVista
                      products={filteredProducts}
                      viewMode="grid"
                      onAdd={handleAddProduct}
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <ProductListSoloVista
                      products={filteredProducts}
                      viewMode="list"
                      onAdd={handleAddProduct}
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
