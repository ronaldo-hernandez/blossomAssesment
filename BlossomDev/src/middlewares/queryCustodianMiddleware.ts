
import { saveRequestInRedis } from '../utils/redisFunctions';
import { insertCharacter , insertKeyRedis, insertKeyAndIds} from '../db/model/requestModel';
import { Request, Response, NextFunction } from 'express';
import {hashReq} from '../utils/hashReqFunction'


/* Middleware para registrar cada solicitud recibida y capturar la respuesta */
const saveInRedis = (req: Request, res: Response, next: NextFunction) => {
    const keyRedis = JSON.stringify(req.body);
    const originalSend = res.send.bind(res); /* Guardar la implementación original de res.send y asegurar que `this` se refiere a `res` */

    res.send = function (body) { 
        /* Manejar la lógica asíncrona fuera de la función res.send */
        (async () => {
            try {
                const resultSaveInRedis = await saveRequestInRedis(keyRedis, body);
                if (resultSaveInRedis === 200) {
                    console.log("Respuesta guardada en REDIS correctamente.");
                } else {
                    console.log("No se pudo guardar la respuesta en REDIS.");
                }
                /* Inserciones en Postgresql*/
                const dataInsertedPsqlSche = await insertKeyAndIds(hashReq(keyRedis), body);
                const dataInsertedPsqlChar = await insertCharacter(body);
                const dataInsertedPsqlKey = await insertKeyRedis(hashReq(keyRedis), body);
            } catch (err) {
                console.error('Error al guardar el valor en Redis:', err);
            }
        })();

        /* Llamar a la implementación original de res.send con los argumentos originales */
        return originalSend(body);
    };

    /* Continuar con el siguiente middleware */
    next();
};

export default saveInRedis;
