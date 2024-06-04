import * as db from "./db";
import { QueryConfig } from "../types/queryConfigType";

export async function createRelations() {
    await changeSchema();
    await createSellerTable();
    await createProductTable();
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
            sellerName VARCHAR(100) NOT NULL,
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
            name VARCHAR(500) NOT NULL,
            specification TEXT NOT NULL,
            price VARCHAR(10) NOT NULL,
            images TEXT ARRAY[10]
        )`
    };
    await db.query(queryConfig);
}