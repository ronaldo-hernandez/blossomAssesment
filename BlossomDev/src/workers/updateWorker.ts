
import { getAllIdsPsglChars, getAllPsglChars, updateByIdPsqlChar  } from "../db/model/requestModel";
import { getCharById } from "../request/requestByIdAPIRequest";
import { CharacterInPsgl } from "../types/schemaEntryData";

/* Permite comprar dos objetos con esquemas de insercion en la tabla de caracteres y puede devolver un objeto vacio si no hay cambios en los datos o un objeto con el id_char (id de caracter) y con el onjeto nuevo a actualizar*/
function filterInfoChanged(dataRequestInAPI: CharacterInPsgl[], dataInSql: CharacterInPsgl[]): { idToUpdate: number, objectToInsert: CharacterInPsgl }[] {
    const differences: { idToUpdate: number, objectToInsert: CharacterInPsgl }[] = [];

    dataRequestInAPI.forEach(item1 => {
        const foundInSql = dataInSql.find(item2 => {
            return Object.keys(item1).every(key => {
                return item1[key as keyof CharacterInPsgl] === item2[key as keyof CharacterInPsgl];
            });
        });

        if (!foundInSql) {
            differences.push({ idToUpdate: item1.id_char, objectToInsert: item1 });
        }
    });

    return differences;
}

/* Integración de funciones de obtención de datos masivos y consultas de actualización en la base de datos. */

export async function updatePsqlChars(){
    const dataToValidate =await getAllIdsPsglChars();
    const dataToValidateComplete =await getAllPsglChars();
    /* Se obtienen las propiedades que son utiliadas en la consulta o que son traidas  */
    const modifedObjects = dataToValidateComplete.map(({ createdAt, updatedAt, id, ...resto }) => resto);
    const promiseOnAPI = dataToValidate.map( async id => {
        try {
            const chart = await getCharById(id);
            const filterInChart = {
                id_char:chart.id,
                name:chart.name,
                status:chart.status,
                species:chart.species,
                type:chart.type,
                gender:chart.gender,
                origin_name:chart.origin.name,
                location_name:chart.location.name,
                image:chart.image,
                created:chart.created
            } 
            return filterInChart;
        }catch (error){
            throw error;
        }
    });
    try {
        /* Se establece una promesa de consulta en la API externa de la información que esta en postgresql  */
        const resultPromiseOn = await Promise.all(promiseOnAPI);
        /* Se comparan los objetos obtenidos  */
        const newDataToUpdate = await filterInfoChanged(resultPromiseOn,modifedObjects);
        if (newDataToUpdate.length !== 0){
            console.log(newDataToUpdate[0])
            const promiseUpdatePsgl = newDataToUpdate.map( async eachChar =>{
                try {
                    const {idToUpdate, objectToInsert} = eachChar;
                    const applyUpdate = await updateByIdPsqlChar(idToUpdate,objectToInsert);
                    return applyUpdate;
                } catch (error){
                    throw error;
                }
            });
            const resultPromiseUpdate = await Promise.all(promiseUpdatePsgl);
            console.log("¡Se han actualizado los datos en POSTGRESQL!")
            return {status:200, response:"Conjunto de datos de TblCharacters actualizado exitosamente."}
        }
        console.log("¡Sin datos que actualizar!")
        return {status:200, response:"Sin datos que actualizar"}
    } catch (error){
        console.error("Error",error);
        return {status:500, response:`Ah ocurrido un error : ${error}`}
    }
    
}


