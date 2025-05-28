// src/Admin/Movimientos/MovimientoList.js
import React from 'react';
import { Table, ModalHeader, ModalBody } from 'reactstrap';

export default function MovimientoList({ movimientos}){
    if (!Array.isArray(movimientos)) return null;

    return (
        <>
            <ModalHeader>Listado de Movimientos</ModalHeader>
            <ModalBody>
                <Table border responsive hover>
                    <thead className="thead-light">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ModalBody>
        </>
    );
}