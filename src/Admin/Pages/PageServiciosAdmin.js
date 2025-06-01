// src/Admin/Servicios/Servicios.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import routes from '../routes';
import ServicioList from '../Servicios/ServicioList';

export default function Servicios(){
    
    const [servicios, setServicios] = useState([]);

    const fetchServicios = async () => {
        try {
            const response = await axios.get(routes.Administracion.Servicios.GET_ALL);
            setServicios(response.data.servicios);
        } catch (error) {
            console.error("Error al obtener servicios:", error);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    return (
        <>
            <ServicioList 
            servicios={servicios} 
            />
        </>
    );
}