import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { building } from '$app/env';
import { DATA_DIR } from '$app/env/private';

function open() {
	// the build imports this module for analysis and must not leave a database file behind
	if (building) return new Database(':memory:');
	mkdirSync(DATA_DIR, { recursive: true });
	const sqlite = new Database(join(DATA_DIR, 'floom.db'));
	sqlite.pragma('journal_mode = WAL');
	return sqlite;
}

export const db = drizzle(open());

if (!building) migrate(db, { migrationsFolder: 'drizzle' });
