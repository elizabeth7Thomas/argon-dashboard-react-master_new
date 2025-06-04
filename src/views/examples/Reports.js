//src/views/examples/Reports.js
import React, { useState } from "react";
import { Container, Card, Row, Col,Button, Table, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, CardHeader,CardBody} from "reactstrap";
import {  faFilePdf, faFileExcel, faFileCsv, faPrint, faDownload,} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeaderReports from "components/Headers/HeaderReports";

const Reports = () => {
  const [reportType, setReportType] = useState("Todos");
  const [dateRange, setDateRange] = useState("Últimos 30 días");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const toggleDate = () => setDateDropdownOpen(prevState => !prevState);

  const reportTypes = [
    "Todos", "Ventas", "Inventario", "Clientes", 
    "Servicios", "Finanzas", "Personal"
  ];

  const dateRanges = [
    "Hoy", "Ayer", "Últimos 7 días", 
    "Últimos 30 días", "Este mes", "Personalizado"
  ];

  const reportsData = [
    {
      id: 1,
      name: "Reporte de Ventas Diarias",
      type: "Ventas",
      date: "2023-11-15",
      generatedBy: "Admin",
      status: "Completado",
      format: "PDF"
    },
    {
      id: 2,
      name: "Inventario Actual",
      type: "Inventario",
      date: "2023-11-14",
      generatedBy: "Sistema",
      status: "Completado",
      format: "Excel"
    },
    {
      id: 3,
      name: "Clientes Activos",
      type: "Clientes",
      date: "2023-11-13",
      generatedBy: "Admin",
      status: "Pendiente",
      format: "CSV"
    },
    {
      id: 4,
      name: "Servicios Realizados",
      type: "Servicios",
      date: "2023-11-12",
      generatedBy: "Sistema",
      status: "Completado",
      format: "PDF"
    },
    {
      id: 5,
      name: "Estado Financiero",
      type: "Finanzas",
      date: "2023-11-10",
      generatedBy: "Admin",
      status: "Completado",
      format: "PDF"
    }
  ];

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = reportType === "Todos" || report.type === reportType;
    return matchesSearch && matchesType;
  });

  const generateReport = (format) => {
    alert(`Generando reporte en formato ${format}`);
    // Lógica para generar reporte aquí
  };

  return (
    <>
      <HeaderReports />
      
      <Container className="mt-4" fluid>
        {/* Filtros y generación de reportes */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Generar Nuevo Reporte</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Tipo de Reporte</Label>
                      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret className="w-100 text-left">
                          {reportType}
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {reportTypes.map(type => (
                            <DropdownItem key={type} onClick={() => setReportType(type)}>
                              {type}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Rango de Fechas</Label>
                      <Dropdown isOpen={dateDropdownOpen} toggle={toggleDate}>
                        <DropdownToggle caret className="w-100 text-left">
                          {dateRange}
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {dateRanges.map(range => (
                            <DropdownItem key={range} onClick={() => setDateRange(range)}>
                              {range}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Col>
                  <Col md="4" className="d-flex align-items-end">
                    <div className="d-flex w-100">
                      <Button color="primary" className="mr-2" onClick={() => generateReport("PDF")}>
                        <FontAwesomeIcon icon={faFilePdf} className="mr-1" /> PDF
                      </Button>
                      <Button color="success" className="mr-2" onClick={() => generateReport("Excel")}>
                        <FontAwesomeIcon icon={faFileExcel} className="mr-1" /> Excel
                      </Button>
                      <Button color="info" onClick={() => generateReport("CSV")}>
                        <FontAwesomeIcon icon={faFileCsv} className="mr-1" /> CSV
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Listado de reportes */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Reportes Generados</h3>
                  </Col>
                  <Col className="text-right">
                    <FormGroup className="mb-0">
                      <Input
                        type="text"
                        placeholder="Buscar reportes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: "300px" }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Generado por</th>
                    <th>Estado</th>
                    <th>Formato</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                      <tr key={report.id}>
                        <td>{report.name}</td>
                        <td>{report.type}</td>
                        <td>{report.date}</td>
                        <td>{report.generatedBy}</td>
                        <td>
                          <span className={`badge badge-${report.status === "Completado" ? "success" : "warning"}`}>
                            {report.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-info">
                            {report.format}
                          </span>
                        </td>
                        <td>
                          <Button color="primary" size="sm" className="mr-2">
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button color="secondary" size="sm">
                            <FontAwesomeIcon icon={faPrint} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No se encontraron reportes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Reports;