// src/Admin/Movimientos/Movimientos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import routes from '../routes';
import MovimientoList from './MovimientoList';
import HeaderAdministracion from 'components/Headers/HeaderAdministracion';

export default function Movimientos(){
    const [movimientos, setMovimientos] = useState([]);

    const fetchMovimientos = async () => {
        try {
            const response = await axios.get(routes.Administracion.Movimientos.GET_ALL_TYPE);
            setMovimientos(response.data.movimientos);
        } catch (error) {
            console.error("Error al obtener movimientos:", error);
        }
    };

    useEffect(() => {
        fetchMovimientos();
    }, []);

    return (
        <>
            <HeaderAdministracion title="Movimientos" />
            <MovimientoList 
                movimientos={movimientos} 
            />
        </>
    );
}