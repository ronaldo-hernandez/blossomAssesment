import { Request, Response, NextFunction } from 'express';

/* Middleware para registrar el tiempo que toma la query en graphql */
export async function logExecutionTime(req:Request, res:Response, next:NextFunction) {
    const start = process.hrtime();
    res.on('finish', () => {
        const duration = process.hrtime(start);
        console.log(`Tiempo de ejecución total: ${duration[0]}s ${duration[1] / 1000000}ms`);
    });
    next();
}