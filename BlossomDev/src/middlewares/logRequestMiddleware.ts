import { Request,Response, NextFunction } from 'express';

/* Middleware para registrar cada solicitud recibida */
const logRequest = (req:Request,res:Response, next:NextFunction) => {
    console.log(`Solicitud Recibida: ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body de consulta:', req.body);
    next();
  };

export default logRequest;



