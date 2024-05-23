
import {firstFifteenData} from '../request/databasePruneRequest';
import { truncateTables } from '../db/model/requestModel';
import { BLOSSOM_TblCharacters } from '../db/entity/charactersModel';


/* Consiste en una función que poda la bases una vez se trunca */
export async function PrunePsgl() {
    try {
        const truncateProcess = await truncateTables();
    } catch(error){
        console.log("No existen las tablas.")
    }
    const firstPruneData = await firstFifteenData();
    const migrateFirstPruneInPsgl = Promise.all(firstPruneData.map( async(result:any) =>{
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
    console.log("Registros (15) iniciales migrados exitosamente.");
    return 1;

}

