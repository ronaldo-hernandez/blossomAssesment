
# Blossom Assessment Case: Backend Developer

## Flujo de Desarrollo

- Version node utilizada: v8.18.0 <br>



En el desarrollo de la API, se tuvieron en cuenta aspectos relacionados con ciertas validaciones en torno al uso de las rutas propuestas en el constructor de la app en Express. A continuación, se presenta el diagrama que permite identificar las rutas dispuestas en el servidor, así como el flujo de desarrollo que representa cada una.

### Diagrama de rutas en la API.
![Diagrama de Rutas](imgBlossomAssesment/DevFlowWithRoutes.png)

## Descripción del Diagrama: 1

El diagrama ilustra las siguientes rutas y su flujo:

- **Ruta 1:** `/graphql`
  - Se dispone principalmente para realizar consultas con la interface de usuario de graphql.
- **Ruta 2:** `/caharcter/:id`
  - Se dispone para realizar consultas al servicio de API externa y poder extraer con base a un id, unicamente los atributos seleccionados.
- **Ruta 3:** `/resetDataBasePgsl/`
  - Se dispone la ruta para truncar la base de caracteres extraidos (BLOSSOM_TblCharacters) y podarla con 15 datos extraidos de la API externa.
- **Ruta 4:** `/updateTblPgql/`
  - Se dispone la ruta para realizar la actualización de la base de caracteres extraidos (BLOSSOM_TblCharacters) si y solo si ha cambiado los datos.
- **Ruta 4:** `/api-docs`
  - Se dispone la ruta para revisar el UI de swagger entorno al compendio de endpoints o rutas activas; poder probarlas y leer documentación adicional de las salidas.


### Diagrama de flujo de consulta en API.

![Diagrama de flujo de consulta](imgBlossomAssesment/HowDevWorksInReq.png)

## Descripción del Diagrama: 2

El diagrama ilustra las siguientes rutas y su flujo:

- **middleware : queryValidationExist**  ==> `src/middlewares/queryValidatorMiddleware.ts` <br>
  - Encargado principalmente de validar si el hash (el cuerpo de la solicitud) ya se ha trabajando anteriormente y se puede entregar en al request (caché.) ; sino esta en redis entonces valida si se encuentra en postgres si está entonces que guarde la informacion en redis y que entregue la información consultada en postgres en respuesta a la solicitud, finalmente si pudo encontrar información en el storage de postgres ni en caché, entonces que invoque **NextFunction** para pasar al siguiente Middleware.<br><br>
- **middleware : queryCustodianMiddleware**  ==> `src/middlewares/queryCustodianMiddleware.ts`<br>
  - Recibiendo el cuerpo de la solicitud de query, se realiza la consulta en la ruta de `/graphql` y por consiguiente se almacena en redis con key del hash, se toman el objeto de respuesta de la solicitud, se mapea con fucniones asincronicas del modelo de bases de datos de migración y se migran a la base en postgres usando el protocolo `sequelize-typescript`. <br><br>
- **middleware : logTimeExecutionMiddleware**  ==> `src/middlewares/logTimeExecutionMiddleware.ts`<br>
  - Se configura un middleware para que imprima por consola el tiempo tomado en la consulta en graphql.



## Instalación:

Se debe descargar o realizar `git clone <url_repo>` para poder tener acceso al script. Por consiguiente se deben realizas las siguientes instalaciones.

```bash
npm init --y
npm install express express-graphql sequelize pg pg-hstore redis ioredis axios graphql
npm install graphql@15.8.0
npm install --save-dev typescript ts-node @types/node @types/express @types/express-graphql @types/sequelize jest @types/jest
npm install --save-dev @types/sequelize
npm install --save-dev @types/node-cron
npm install @types/swagger-ui-express
```

Recordar que debe tener instalado [redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) y tambien instalado un controlador de bases de datos [postgresql](https://www.postgresql.org/download/) .

### Recomenaciones para inicialización.

- **npm run dev:** El comando por consola de inicialización `npm run dev`, utiliza el modulo de `nodemon` el cual reinicia la compilación de servicio esporadicamente, cabe recordar que hay un worker que realiza el reseteo de la base para la agregación de 15 registros al reiniciar el servidor, por lo tanto este worker se activaria en cada reinicio de sesión realizada por el nodemon. <br><br>
- **npm start:** Por el contrario el comando por consola de inicialización `npm start`, utiliza el modulo de `ts-node` para iniciar una y unica vez el servidor. <br><br>


### Recomenaciones para set up del controlador de bases de datos.

Para efectos de la prueba se creo una base de datos,(en la siguiente imagen se presenta).

- Siguiendo los siguiente comando en [Sequelize](https://sequelize.org/docs/v6/other-topics/migrations/)

[Base en Postgresql](imgBlossomAssesment/dbInPsgql.png)
 


