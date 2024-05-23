
import crypto from 'crypto';


/* Se construye una función para hasear la query de entrada en el GraphiQL, este devuelve el valor de la key que será almacenada en redis. */


export function hashReq(keyRedis:any){
    const hash = crypto.createHash('sha256');
    hash.update(keyRedis)
    const hashedRequestBody = hash.digest('hex');
    return hashedRequestBody
}

    