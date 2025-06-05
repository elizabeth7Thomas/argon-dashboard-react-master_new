import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'reactstrap';
import HeaderTienda from 'components/Headers/HeaderTienda';

const ReportesTienda = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const obtenerVentas = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://64.23.169.22:3761/broker/api/rest',
        {
          metadata: { uri: 'tienda-conveniencia/GET/ventas/' },
          request: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setVentas(response.data.response.data);
      console.log('Ventas:', response.data.response.data);
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
  );
};

export default ReportesTienda;
