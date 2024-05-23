import axios from 'axios';
import { Character } from '../types/schemaEntryData';

/* Consulta en la web a partir del endpoint de la API externa */

export async function getCharById(id: number):Promise<Character> {
    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        const character = response.data;
        const mappedChar = {
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            type: character.type,
            //gender: character.gender + " Algo Más", /* Probar funcionamiento de actualización en el CRON JOB */
            gender: character.gender ,
            origin: character.origin,
            location: character.location,
            image: character.image,
            created: character.created}
        return mappedChar;
    } catch (error) {
        throw new Error(`No se pudo extraer los datos; razon : ${error}`);
    }
}
