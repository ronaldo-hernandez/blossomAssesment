


import {checkIfExistRedis, getRequestFromRedis, saveRequestInRedis } from '../utils/redisFunctions';
import { checkIfExistPsglIdem } from '../db/model/requestModel';
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
dotenv.config();



/* Mddleware para validar la existencia de la consulta graphql en cache - redis ó postgres. */

const queryValidationExist =  async (req:Request, res: Response, next:NextFunction) => {
    /* Se valida con la función checkIfExistRedis si el hash generado de la consulta se encuentra guardado en cache.*/
    console.log("______________ Se empezo a validar si existe en redis.______________")
    const entryBody = JSON.stringify(req.body)
    const validationRedisApply = await checkIfExistRedis(entryBody);
    if (validationRedisApply===1){
        /* Si se encuentra en caché, se evita utilizar la API y se responde con los datos almacenados. */
        console.log("______________ Se encontró en redis.______________")
        const dataInRedis = await getRequestFromRedis(entryBody);
        if (dataInRedis !== null){
            /* Siempre y cuando no sean nulos los datos encontrados */
            return res.status(200).send(dataInRedis);
        }
    } else {
        console.log("______________ No se encontró en redis.______________")
        console.log("______________ Se empezo a validar si existe en postgresql.______________")
        /* Si por el contrario no se encontró cache, se revisa en postgres. */
        const validationPsqlApply = await checkIfExistPsglIdem(entryBody);
        if (validationPsqlApply !== null){
            console.log("______________ Se encontró en postgresql.______________")
            /* Si se encuentra información en postgresql acerca de la query entonces que se muestren en respuesta y se guarde en redis. */
            const resultSaveInRedis = await saveRequestInRedis(entryBody, validationPsqlApply);
                if (resultSaveInRedis === 200) {
                    console.log("BackUp de postgres guardada en REDIS correctamente.");
                } else {
                    console.log("No se pudo guardar la respuesta en REDIS.");
                }
            return res.status(200).send(validationPsqlApply);
        }
        /* Si no se pudo reciclar datos en postgresql, ni mucho menos en Redis; entonces que pase al siguiente middleware. */
        
    }
    next();
}

export default queryValidationExist;
