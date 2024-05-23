import { Sequelize } from 'sequelize-typescript';
import {BLOSSOM_TblCharacters, BLOSSOM_IdempotencyTable, BLOSSOM_SchemaKeysById} from '../db/entity/charactersModel';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE = process.env.DATABASE;
const USERNAME_DB = process.env.USERNAME_DB;
const PASS_DB = process.env.PASS_DB;

/* Se configura una instancia en sequelize con los parametros de conexión.  */
const sequelize = new Sequelize({
  database: DATABASE,
  dialect: 'postgres',
  username: USERNAME_DB,
  password: PASS_DB,
  storage: ':memory:',
  models: [__dirname + 'src/models'],
  logging:false
});

sequelize.addModels([BLOSSOM_TblCharacters,BLOSSOM_IdempotencyTable,BLOSSOM_SchemaKeysById]);
export default sequelize;