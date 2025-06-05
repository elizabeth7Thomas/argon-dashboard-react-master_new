import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Table,
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
import HeaderTienda from "components/Headers/HeaderTienda";

const TiendaPreparados = () => {
  const [idProducto, setIdProducto] = useState("");
  const [receta, setReceta] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const obtenerReceta = async () => {
    if (!idProducto) return;

    try {
      const token = localStorage.getItem("token"); // Asegúrate de tenerlo guardado

      const response = await axios.post(
        "http://64.23.169.22:3761/broker/api/rest",
        {
          metadata: {
            uri: `tienda-conveniencia/GET/recetas/${idProducto}`
          },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data.response?.data || [];
      setReceta(data);
    } catch (error) {
      console.error("Error al obtener receta:", error);
      setErrorMsg("No se pudo obtener la receta. Verifica el producto y el token.");
      setModalError(true);
    }
  };

  return (
    <>
    <HeaderTienda />
      <div className="container mt-4">
           
      <h3>Receta de Producto Preparado</h3>
      <FormGroup>
        <Label for="idProducto">ID del Producto Preparado</Label>
        <Input
          id="idProducto"
          type="number"
          value={idProducto}
          onChange={(e) => setIdProducto(e.target.value)}
          placeholder="Ingrese ID del producto"
        />
      </FormGroup>
      <Button color="primary" onClick={obtenerReceta}>
        Consultar Receta
      </Button>

      <hr />

      {receta.length > 0 && (
        <Table striped responsive className="mt-4">
          <thead>
            <tr>
              <th>Materia Prima</th>
              <th>Descripción</th>
              <th>Cantidad Requerida</th>
              <th>Unidad</th>
              <th>Precio Referencia</th>
            </tr>
          </thead>
          <tbody>
            {receta.map((item) => (
              <tr key={item.id}>
                <td>{item.productoMateriaPrima?.nombre}</td>
                <td>{item.productoMateriaPrima?.descripcion}</td>
                <td>{item.cantidad_requerida}</td>
                <td>{item.productoMateriaPrima?.unidades_medida?.abreviatura}</td>
                <td>${item.productoMateriaPrima?.precio_referencia}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={modalError} toggle={() => setModalError(false)}>
        <ModalHeader toggle={() => setModalError(false)}>Error</ModalHeader>
        <ModalBody>{errorMsg}</ModalBody>
      </Modal>
    </div>
     </>
  );
};

export default TiendaPreparados;
