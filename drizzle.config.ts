import { mkdirSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

const dataDir = process.env.DATA_DIR || './data';
mkdirSync(dataDir, { recursive: true });

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dbCredentials: { url: `${dataDir}/floom.db` }
});
