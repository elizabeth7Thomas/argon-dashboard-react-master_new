import React from 'react';
import { Table, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const mockBombs = [
  {
    bombId: '1',
    bombNumber: 1,
    servedQuantity: 120.5,
    employeeInCharge: { employeeName: 'Carlos Pérez' },
    status: 1,
  },
  {
    bombId: '2',
    bombNumber: 2,
    servedQuantity: 80.2,
    employeeInCharge: { employeeName: 'Laura Gómez' },
    status: 0,
  },
];

export default function PumpStatusList({ onEdit }) {
  return (
    <Table bordered responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Bomba</th>
          <th>Cantidad Servida</th>
          <th>Encargado</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {mockBombs.map((pump, i) => (
          <tr key={pump.bombId}>
            <th scope="row">{i + 1}</th>
            <td>{pump.bombNumber}</td>
            <td>{pump.servedQuantity} gal</td>
            <td>{pump.employeeInCharge.employeeName}</td>
            <td>{pump.status === 1 ? 'Activo' : 'Inactivo'}</td>
            <td>
              <Button size="sm" color="info" onClick={() => onEdit(pump)}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
