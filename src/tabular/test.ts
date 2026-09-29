import { connect } from '@tursodatabase/database';
import { Database } from '@tursodatabase/database';

import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { doc } from './schema.ts';

const client = new Database(':memory:');
const db = drizzle({ client });
const result = await db.select().from(doc);

// const db = await connect(':memory:', {
// 	experimental: ["custom_types"],
// });
// await db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT[]) STRICT');
// await db.exec("INSERT INTO users (name) VALUES (ARRAY['Alice', 'Allie'])");
// const users = await (await db.prepare('SELECT * FROM users')).raw(false).all()
// console.log(users); // { id: 1, name: '{Alice,Allie}' }
