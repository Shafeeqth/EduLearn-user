import { DataSource } from 'typeorm';
import { getEnvs } from '@mdshafeeq-repo/edulearn-common';
import path from 'path';

const { DATABASE_URL } = getEnvs('DATABASE_URL');

export const AppDataSource = new DataSource({
  type: 'postgres', // Specifies the database type
  url: DATABASE_URL, // Database connection URL
  synchronize: process.env.NODE_ENV !== 'production', // Disable synchronization in production
  entities: [path.resolve(__dirname, '../entities/*.ts')], // Paths to the entity files
  migrations: [path.resolve(__dirname, '../migrations/*.ts')], // Paths to the migration files
  logging: ['error', 'migration'], // Enables logging for errors and migrations
  cache: {
    duration: 30000, // Cache duration in milliseconds (30 seconds)
  },
  extra: {
    max: 20, // maximum number of connections in the pool
    min: 5, // minimum number of connections in the pool
    idleTimeoutMillis: 30000, // close idle connections after 30 seconds
    connectionTimeoutMillis: 4000, // return an error after 4 seconds if connection could not be established
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
