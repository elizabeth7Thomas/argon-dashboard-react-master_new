// /src/components/pinturas/pinturasTable.js
import React, { /*useEffect, useState*/ } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const PinturasTable = ({pinturas = [], onClick, onEditarClick, onVerClick, onAgregarClick, onBuscarCodigoChange}) => {

  return (
    <Container className="mt--7" fluid>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0 d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Pinturas</h3>
              <div className="d-flex flex-wrap gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por código"
                  onChange={onBuscarCodigoChange}
                />
              </div>
              <button className="btn btn-primary" onClick={onAgregarClick}>Agregar pintura</button>
            </CardHeader>

            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th>Código</th>
                  <th>Color</th>
                  <th>Tipo de pintura</th>
                  <th>Existencias</th>
                  <th>Numero de lote</th>
                  <th>Fecha de vencimiento</th>
                  <th>Fecha de adquisicion</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {pinturas.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan="8" className="text-center">No hay pinturas disponibles.</td>
                  </tr>
                ) : (
                  pinturas.map((pintura) => (
                    <tr key={pintura.codigo}>
                      <td>{pintura.codigo}</td>
                      <td>{pintura.nombre}</td>
                      <td>{pintura.tipoPintura}</td>
                      <td>{pintura.existencias}</td>
                      <td>{pintura.precio}</td>
                      <td>{pintura.numeroLote}</td>
                      <td>{pintura.fechaVencimiento}</td>
                      <td>{pintura.fechaAdquisicion}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle className="btn-icon-only text-light" size="sm">
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                             <DropdownMenu right>
                                <DropdownItem onClick={() => onVerClick(pintura)}>Ver</DropdownItem>
                                <DropdownItem onClick={() => onEditarClick(pintura)}>Editar</DropdownItem>
                                <DropdownItem>Eliminar</DropdownItem>
                              </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default PinturasTable;