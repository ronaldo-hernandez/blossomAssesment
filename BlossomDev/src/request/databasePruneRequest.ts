
import axios from 'axios';


/* Consulta en web para obtener el compendio de caracteres de api */

export async function firstFifteenData() {
    try {
        const response = await axios.get("https://rickandmortyapi.com/api/character");
        const characters =response.data.results;
        console.log(characters.length);
        return response.data.results.slice(0,15);

    } catch (error) {
        throw new Error('No se pudo extraer los datos.');
    };
}




