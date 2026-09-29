import { Database } from '@tursodatabase/database-wasm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { doc } from '../tabular/schema.ts';

const client = new Database(':memory:');
const db = drizzle({ client });
const result = await db.select().from(doc);
console.log(result);
