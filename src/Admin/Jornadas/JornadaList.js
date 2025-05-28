// src/Admin/Jornadas/JornadaList.js
import React from 'react';
import { Table, ModalHeader, ModalBody} from 'reactstrap';

export default function JornadaList({ jornadas}) {
    if (!Array.isArray(jornadas)) return null;
    return (
        <>
            <ModalHeader>Listado de Jornadas</ModalHeader>
            <ModalBody>
                <Table bordered responsive hover>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Días laborales</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                    </tr>
                    <tbody>
                        {jornadas.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.dias_laborales.join(', ')}</td>
                                <td>{item.hora_entrada}</td>
                                <td>{item.hora_salida}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ModalBody>
        </>
    );
}