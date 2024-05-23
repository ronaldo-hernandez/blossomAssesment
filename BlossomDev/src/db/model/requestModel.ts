
import { hashReq } from '../../utils/hashReqFunction';
import {BLOSSOM_TblCharacters,BLOSSOM_IdempotencyTable, BLOSSOM_SchemaKeysById} from '../entity/charactersModel';
import { Character } from '../../types/schemaEntryData';
import { CharacterInPsgl } from "../../types/schemaEntryData";

export function filterNewValues(newDataInsert:number[], dataInSql:number[] ) {
    
    return newDataInsert.filter(element => ! dataInSql.includes(element));
}

/* Funciones para inserción de datos (CREATE) en postgres. */
/* ____________________________________________________________________________________________________________________________________________________________ */

/* Funcion para insertar el cuerpo de uno o muchos characteres en la tabla a partir de el HASH de query y los datos reponsivos: Tabla de Caracteres */
export async function insertCharacter(dataInput : any) {
    const dataFormatted = JSON.parse(dataInput);
    const resultQuery = dataFormatted?.data?.charactersByFilter?.results;
    if (resultQuery){
        const actualIdsPsgl = await getAllIdsPsglChars();
        console.log(" ✅ OBETENER INFO DE PSQL =====>::: ", actualIdsPsgl);
        const newIdsToInsert = resultQuery.map((result:Character) => Number(result.id));
        console.log(" ✅ RESULTADO QUERY EN GRAPHQL =====>::: ", newIdsToInsert);
        const idsFiltered = filterNewValues(newIdsToInsert,actualIdsPsgl);
        console.log(idsFiltered)
        const idsForFilter: string[] = idsFiltered.map(id => String(id)) ;
        const characters: Character[] = resultQuery;
        const filteredCharacters = characters.filter(character => idsForFilter.includes(String(character.id)));
        const insertedCharacters = await Promise.all(filteredCharacters.map(async (result:any) => {
            const {id,name,status,species,type,gender, origin,location,image, created} = result;
            const originName = origin.name;
            const locationName = location.name;
            const dataChars = {
                id_char:id, 
                name ,
                status,
                species,
                type,
                gender, 
                origin_name:originName,
                location_name:locationName,
                image,
                created,
                updatedAt: new Date() as unknown as Date // Incluir valor para updatedAt
            };
            return await BLOSSOM_TblCharacters.create(dataChars);
        }));
        console.log("3). Registros insertados correctamente en POSTGRESQL : tabla de caracteres.")
    }
}


/* Funcion para insertar la key y el id del caracter uno o muchos en la tabla a partir de el HASH de query y los datos reponsivos: Tabla conexion redis y caracteres. */
export async function insertKeyAndIds(keyRedis:string,dataInput : any) {
    const dataFormatted = JSON.parse(dataInput);
    const resultQuery = dataFormatted?.data?.charactersByFilter?.results;
    if (resultQuery){
        const insertedCharacters = await Promise.all(resultQuery.map(async (result:any) => {
            const {id} = result;
            const dataChars = {
                key_redis:keyRedis,
                id_char:id, 
            };
            return await BLOSSOM_SchemaKeysById.create(dataChars);
            
        }));
        console.log("2). Registros insertados correctamente en POSTGRESQL : tabla conexion redis y caracteres.")
    }
    
}


/* Función para insertar la key de redis y el body de respuesta obtenido : Tabla imagen de redis.*/
export async function insertKeyRedis(keyRedis:string, bodyRedis:string) {
    let keysForRedis = {
        key_redis:keyRedis,
        body_redis:bodyRedis
    };
    const insetedKeys = await BLOSSOM_IdempotencyTable.create(keysForRedis);
    console.log("1). Registros insertados correctamente en POSTGRESQL : tabla imagen de redis.")
}


/* Funciones para revisión de datos en la db (READ) */
/* ____________________________________________________________________________________________________________________________________________________________ */

export async function checkIfExistPsglIdem(keyRedis: string) {
    const key_redis = hashReq(keyRedis)
    const savedObject = await BLOSSOM_IdempotencyTable.findOne({where:{key_redis:key_redis}})
    if (savedObject !== null){
        const bodyRes = savedObject.dataValues.body_redis;
        return bodyRes;
    }
    return null;
}


export async function getAllIdsPsglChars() {
    try {
        const allCharacters = await BLOSSOM_TblCharacters.findAll();
        return allCharacters.map(character => character.dataValues.id_char);
    } catch (error) {
        console.error('⚠️ Error obteniendo los caracteres de consulta:', error);
        throw error;
    }
}

export async function getAllPsglChars() {
    try {
        const allCharacters = await BLOSSOM_TblCharacters.findAll();
        return allCharacters.map(character => character.dataValues);
    } catch (error) {
        console.error('⚠️ Error obteniendo los caracteres de consulta:', error);
        throw error;
    }
}




/* Funciones para reset de datos en la db (TRUNCATE) */
/* ____________________________________________________________________________________________________________________________________________________________ */

export async function truncateTables() {
    try {
        await BLOSSOM_IdempotencyTable.truncate({ cascade: true });
        await BLOSSOM_SchemaKeysById.truncate({ cascade: true });
        await BLOSSOM_TblCharacters.truncate({ cascade: true });
        console.log('All tables truncated successfully.');
    } catch (error) {
        console.error('Error truncating tables:', error);
    }
}

/* Funciones para actualizar en la base de datos (UPDATE) */
/* ____________________________________________________________________________________________________________________________________________________________ */

export async function updateByIdPsqlChar(id_char:number, updatedData:CharacterInPsgl){
    try{
        const character = await BLOSSOM_TblCharacters.findOne({where:{id_char:id_char}})
        const updatedObjectId = await character?.update(updatedData);
        if (updatedObjectId){
            return true;
        } else {
            return false;
        }
    } catch (error){
        console.error('Error al actualizar el personaje:', error);
        return false;

    }
}