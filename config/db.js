import { neon } from "@neondatabase/serverless";
import "dotenv/config";

//create a new instance of neon with the DATABASE_URL from environment variables
export const sql = neon(process?.env?.DATABASE_URL);
