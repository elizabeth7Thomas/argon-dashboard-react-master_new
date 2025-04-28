import React, { useState } from "react";
import {
   
Container,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";
import axios from "axios";
import HeaderTienda from "components/Headers/HeaderTienda";

const RutasTienda = () => {
  const [tipoReporte, setTipoReporte] = useState("diario");
  const [datosEntrada, setDatosEntrada] = useState({});
  const [resultados, setResultados] = useState([]);

  const handleInputChange = (e) => {
    setDatosEntrada({
      ...datosEntrada,
      [e.target.name]: e.target.value,
    });
  };

  const handleBuscar = async () => {
    let url = "";
    switch (tipoReporte) {
      case "diario":
        url = "/administracion/movimientos/diarios";
        break;
      case "mensual":
        url = "/administracion/movimientos/mensuales";
        break;
      case "trimestral":
        url = "/administracion/movimientos/trimestrales";
        break;
      case "semestral":
        url = "/administracion/movimientos/semestrales";
        break;
      case "anual":
        url = "/administracion/movimientos/anuales";
        break;
      default:
        return;
    }

    try {
      const res = await axios.get(url, {
        params: {
          ...datosEntrada,
          servicio: "tienda",
        },
      });
      setResultados(res.data);
    } catch (error) {
      console.error("Error al obtener los reportes", error);
      alert("Hubo un error al obtener los reportes.");
    }
  };

  const renderCamposEntrada = () => {
    switch (tipoReporte) {
      case "diario":
        return (
          <FormGroup>
            <Label for="fecha">Fecha</Label>
            <Input
              type="date"
              name="fecha"
              onChange={handleInputChange}
            />
          </FormGroup>
        );
      case "mensual":
        return (
          <>
            <FormGroup>
              <Label for="mes">Mes</Label>
              <Input
                type="number"
                name="mes"
                min="1"
                max="12"
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="anio">Año</Label>
              <Input
                type="number"
                name="anio"
                onChange={handleInputChange}
              />
            </FormGroup>
          </>
        );
      case "trimestral":
        return (
          <>
            <FormGroup>
              <Label for="trimestre">Trimestre</Label>
              <Input
                type="number"
                name="trimestre"
                min="1"
                max="4"
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="anio">Año</Label>
              <Input
                type="number"
                name="anio"
                onChange={handleInputChange}
              />
            </FormGroup>
          </>
        );
      case "semestral":
        return (
          <>
            <FormGroup>
              <Label for="semestre">Semestre</Label>
              <Input
                type="number"
                name="semestre"
                min="1"
                max="2"
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="anio">Año</Label>
              <Input
                type="number"
                name="anio"
                onChange={handleInputChange}
              />
            </FormGroup>
          </>
        );
      case "anual":
        return (
          <FormGroup>
            <Label for="anio">Año</Label>
            <Input
              type="number"
              name="anio"
              onChange={handleInputChange}
            />
          </FormGroup>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <HeaderTienda />
    <Container className="mt--7" fluid>
    <div className="col">
    
   
    <Card className="shadow">
      <CardHeader>📊 Reportes de Tienda</CardHeader>
      <CardBody>
        <FormGroup>
          <Label for="tipoReporte">Tipo de reporte</Label>
          <Input
            type="select"
            name="tipoReporte"
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
          >
            <option value="diario">Diario</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </Input>
        </FormGroup>

        {renderCamposEntrada()}

        <Button color="primary" onClick={handleBuscar}>
          Buscar
        </Button>

        {resultados.length > 0 && (
          <>
            <h5 className="mt-4">Resultados:</h5>
            <Table responsive bordered striped>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((mov, i) => (
                  <tr key={i}>
                    <td>{mov.fecha}</td>
                    <td>{mov.descripcion}</td>
                    <td>Q{parseFloat(mov.monto).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </CardBody>
    </Card>
    
    </div>
    
    </Container>
    </>
  );
};

export default RutasTienda;
