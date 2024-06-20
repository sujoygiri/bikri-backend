import { Pool } from "pg";
import { QueryConfig } from "../types/typesAndInterfaces";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const query = async (queryConfig: QueryConfig) => {
    const queryResult = await pool.query(queryConfig);
    return queryResult;
};

