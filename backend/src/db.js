import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'filmboxuser',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'filmbox',
  client_encoding: 'UTF8',
});

export const query = (text, params) => pool.query(text, params);