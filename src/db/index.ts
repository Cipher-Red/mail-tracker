import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// For server-side only
let db: ReturnType<typeof drizzle>;

// Only initialize postgres on the server side
if (typeof window === 'undefined') {
  // Get database connection string from environment variables
  const connectionString = process.env.DATABASE_URL || '';
  
  // Create postgres connection
  const client = postgres(connectionString, { prepare: false });
  
  // Create drizzle database instance with schema
  db = drizzle(client, { schema });
} else {
  // Provide a dummy db object for client-side
  db = {} as ReturnType<typeof drizzle>;
}

export { db };
