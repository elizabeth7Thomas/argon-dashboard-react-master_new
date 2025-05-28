// src/Admin/Jornadas/Jornadas.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes';
import JornadaList from './JornadaList'; 
import HeaderAdministracion from 'components/Headers/HeaderAdministracion';

export default function Jornadas(){
    const [jornadas, setJornadas] = useState([]);

    const fetchJornadas = async () => {
        try {
            const response = await axios.get(routes.Administracion.Jornadas.GET_ALL);
            setJornadas(response.data.jornadas);
        } catch (error) {
            console.error("Error al obtener jornadas:", error);
        }
    };
    useEffect(() => {
        fetchJornadas();
    }, []);

    return (
        <>
            <HeaderAdministracion title="Jornadas" />
            <JornadaList jornadas={jornadas} />
        </>
    );
};
