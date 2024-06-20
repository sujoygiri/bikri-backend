import * as db from "./db";
import { QueryConfig } from "../types/typesAndInterfaces";

export async function createRelations() {
    await createSchema();
    await changeSchema();
    await createSellerTable();
    await createProductTable();
    return `Db initialization successful`;
}

async function createSchema() {
    const createSchemaQuery: QueryConfig = {
        text: `CREATE SCHEMA IF NOT EXISTS bikridotcomschema;`
    };
    await db.query(createSchemaQuery);
}

async function changeSchema() {
    const queryConfig: QueryConfig = {
        text: `SET search_path TO bikridotcomschema`
    };
    await db.query(queryConfig);
}

async function createSellerTable() {
    const queryConfig: QueryConfig = {
        text: `CREATE TABLE IF NOT EXISTS sellers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            sellername VARCHAR(100) NOT NULL,
            email VARCHAR(500) UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`
    };
    await db.query(queryConfig);
}

async function createProductTable() {
    const queryConfig: QueryConfig = {
        text: `CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            seller_id UUID REFERENCES sellers(id),
            name VARCHAR(500) NOT NULL,
            specification TEXT NOT NULL,
            price VARCHAR(2) NOT NULL,
            images TEXT ARRAY[10]
        )`
    };
    await db.query(queryConfig);
}

export async function resetDb() {
    const dropSchemaQuery: QueryConfig = {
        text: `DROP SCHEMA bikridotcomschema CASCADE;`
    };
    await db.query(dropSchemaQuery);
    return `All relation deleted successfully!`;
}

