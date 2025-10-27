import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import 'dotenv/config';

if (!process.env.NEON_URL) {
  throw new Error('NEON_URL is undefined');
}

// Init Neon client
const sql = neon(process.env.NEON_URL);

// Init Drizzle
export const db = drizzle({ client: sql });
