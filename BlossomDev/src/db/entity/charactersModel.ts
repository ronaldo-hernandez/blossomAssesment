import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

/* Modelos de entidades para la tabla que funciona para verificacion del hash de entrada.*/
@Table
export class BLOSSOM_IdempotencyTable extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ type: DataType.STRING, unique: true })
    key_redis!: string; // Cambiado a INTEGER

    @Column({ type: DataType.TEXT })
    body_redis!: string;
}

/* Modelos de entidades para la tabla que recibe el hash y lo relaciona con los id de los caracteres.*/
@Table
export class BLOSSOM_SchemaKeysById extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ type: DataType.STRING })
    key_redis!: string;

    @Column({ type: DataType.INTEGER })
    id_char!: number;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}

/* Modelos de entidades para la tabla que recibe el objeto de inserción de caracteres.*/
@Table
export class BLOSSOM_TblCharacters extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ type: DataType.INTEGER, unique:true })
    id_char!: number;

    @Column({ type: DataType.STRING })
    name!: string;

    @Column({ type: DataType.STRING })
    status!: string;

    @Column({ type: DataType.STRING })
    species!: string;
    
    @Column({ type: DataType.STRING })
    type!: string;

    @Column({ type: DataType.STRING })
    gender!: string;

    @Column({ type: DataType.STRING })
    origin_name!: string;
    
    @Column({ type: DataType.STRING })
    location_name!: string;
    
    @Column({ type: DataType.STRING })
    image!: string;
    
    @Column({ type: DataType.STRING })
    created!: string;

    @UpdatedAt
    updatedAt!: Date;

}


