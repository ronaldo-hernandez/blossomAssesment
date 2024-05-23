
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './types/schemaGraphQL';
import resolvers from './request/resolvers';
import bodyParser from 'body-parser';
import queryValidationExist from './middlewares/queryValidatorMiddleware';
import saveInRedis from './middlewares/queryCustodianMiddleware';
import { PrunePsgl } from './workers/pruneWorker';
import { getCharById } from './request/requestByIdAPIRequest';
import { removeKeysInRedis } from './utils/redisFunctions';
import { updatePsqlChars } from './workers/updateWorker';
import cron from 'node-cron';
import { startServerSetUp } from './utils/startServerFunction';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './documents/swagger.json';
import { logExecutionTime } from './middlewares/logTimeExecutionMiddleware';
import logRequest from './middlewares/logRequestMiddleware';
import dotenv from 'dotenv';

dotenv.config()



/* Se inicializa el servidor construyendo las tablas de migraciones en PostgreSQL y Agregando datos inciales. */
startServerSetUp();

/* Eliminar la información almacenada en Redis, con inicialización en cero de caché. */
removeKeysInRedis()
    .then(response => {
      console.log("Se eliminaron todas las keys")
    })
    .catch(error => {
      console.error('Fallo eliminación de keys:', error);
  });




/* Construccion de la App */
const app = express();

 /* Se configuran las variables de entorno */

const port = Number(process.env.APP_PORT) || 3000; 
const host = process.env.APP_HOST ||'localhost'; 

/* Middleware para analizar el cuerpo de las solicitudes */
app.use(bodyParser.json());




/* Definicion de las rutas y middlewares en la ruta de consulta del graphql */
app.use('/graphql',logRequest,logExecutionTime,queryValidationExist,saveInRedis,graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

/* Definicion de la ruta para consulta de caracter en la API externa a partird el id del caracter. */
app.get('/character/:id', async (req, res) =>{
  const id = req.params.id;
  try {
    const char = await getCharById(Number(id));
    res.json(char)
  } catch (error) {
    res.status(500).json({error:`Algo ocurrio, razon: ${error}`});
  }
})

/* Definicion de la ruta para el reseteo de la base de datos en postgres. */
app.get('/resetDataBasePgsl/', async (req,res) =>{
  const resultPrune = await PrunePsgl();
  if (resultPrune === 1){
    res.status(200).json({status:200, response:"Se reseteó la base correctamente."})
  } else {
    res.status(500).json({status:500, response:"No se pudo resetar la base."})
  }

});

/* Definicion de la ruta para la actualizacion de los registros comparados con la api. */
app.get('/updateTblPgql/', async(req, res) => {
  const updatedChars = await updatePsqlChars();
  res.status(200).json(updatedChars);
});

/* Objeto de configuración de el cronjob : Para ejecución cada doce horas y/o para ejecución cada 10 segundos (para revision del funcionamiento) */
const setCronJob = {set12HoursInterval:'0 */12 * * *',set10SecInterval:'*/10 * * * * *'}

/* Activación del cron job */
cron.schedule(setCronJob.set12HoursInterval, async () => {
  await updatePsqlChars();
});

/* Activación de la ruta en swagger para revisar documentacion de la api. */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* Iniciar el servidor */
app.listen(port, host, () => {
  console.log(`Servidor GraphQL escuchando en http://${host}:${port}/graphql`);
});
