
import client from '../manager/redisClient'
import {hashReq} from '../utils/hashReqFunction'

const TIME_EXPIRE = 43200

/* Guardar la informacion del body de response de la solicitud en redis con una llave correspondiente al hash */
export async function saveRequestInRedis(key:string, body:string){
    try {
        const hash = hashReq(key)
        const resultClient = await client.set(hash, body, 'EX',TIME_EXPIRE);
        if (resultClient === 'OK') {
            console.log("Consulta guardada correctamente en REDIS con el hash: ", hash);
            return 200;
        } else {
            console.log("No fue posible guardar la consulta en redis.");
            return 500;
        }
    } catch(error){
        throw error;
    } 
}

/* Verifica si existen datos en redis para un llave en particular (hash) */
export async function checkIfExistRedis(key: string): Promise<number> {
    try {
        const hash = hashReq(key);
        const exist = await client.exists(hash);
        console.log(exist === 1);
        return exist ;
    } catch (error) {
        console.error("Error al verificar la existencia en redis:", error);
        return 500;
    }
}

/* Función para obtener información de una clave en Redis */
export async function getRequestFromRedis(key: string): Promise<string | null> {
    try {
        const hash = hashReq(key);
        const data = await client.get(hash);
        if (data) {
            console.log("Se obtuvieron datos de Redis.")
            return data;
        } else {
            console.log("No se encontraron datos para la clave:", hash);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener datos de Redis:', error);
        throw error;
    }
}

/* En el inicio del server se desea eliminar las llaves para el inicio unicamente. */
export async function removeKeysInRedis(): Promise<void> {
    try {
        // Obtener todas las claves en Redis
        const keys = await client.keys('*');

        // Eliminar todas las claves encontradas
        await Promise.all(keys.map(async (key) => {
            await client.del(key);
        }));

        console.log('Todas las claves eliminadas en Redis');
    } catch (error) {
        console.error('Error al eliminar las claves en Redis:', error);
        throw error;
    }
}