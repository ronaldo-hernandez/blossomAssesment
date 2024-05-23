import sequelize from '../config/dbConnection';
import { PrunePsgl } from '../workers/pruneWorker';

/* Funcion asincronica que permite respetar la secuencia de compilación entre la construccion de las bases en sequelize y el prunning (podado de registros en las nuevas tablas.) */
export async function startServerSetUp() {
    try {
        await sequelize.sync();
        console.log('Base de datos y tablas sincronizadas correctamente');
        await PrunePsgl();
        console.log('Resultado de Prunning :', true);
    } catch (error){
        console.error;
    }
}

