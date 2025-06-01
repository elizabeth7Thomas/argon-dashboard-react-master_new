// src/gasoline/GasolineTypes/GasolineTypeList.js
import React from 'react';
import { Card, CardBody, Table, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function GasolineTypeList({ fuels, onEdit, onDelete }) {
  return (
    <Card className="shadow">
      <CardBody>
        <Table responsive>
          <thead>
            <tr>
              <th>Nombre del Combustible</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fuels.map(f => (
              <tr key={f.fuelId}>
                <td>{f.fuelName}</td>
                <td>{f.status ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button color="info" size="sm" onClick={() => onEdit(f)} className="mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button color="danger" size="sm" onClick={() => onDelete(f.fuelId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
