import * as db from "./db";
import { QueryConfig } from "../types/queryConfigType";

export async function createRelations() {
    try {
        await createSchema();
        await changeSchema();
        await createRoleEnum();
        await createUserTable();
        await createProductTable();
        return `Db initialization successful`;
    } catch (error) {
        throw error;
    }
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

async function createRoleEnum() {
    const dropRoleEnumQuery: QueryConfig = {
        text: `DROP TYPE IF EXISTS user_role CASCADE`
    };
    await db.query(dropRoleEnumQuery);
    const createRoleEnumQuery: QueryConfig = {
        text: `CREATE TYPE user_role AS ENUM ('admin', 'seller', 'user');`
    };
    await db.query(createRoleEnumQuery);
}

async function createUserTable() {
    const queryConfig: QueryConfig = {
        text: `CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            userName VARCHAR(100) NOT NULL,
            email VARCHAR(500) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role user_role DEFAULT 'user'
        )`
    };
    await db.query(queryConfig);
}

async function createProductTable() {
    const queryConfig: QueryConfig = {
        text: `CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

