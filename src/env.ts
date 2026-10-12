import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	ADMIN_PASSWORD: {
		description: 'Superuser password',
		schema: (value) => {
			if (building) return value ?? '';
			if (!value) throw new Error('ADMIN_PASSWORD must be set');
			return value;
		}
	},
	DATA_DIR: {
		description: 'Directory holding the SQLite file and the plant photos',
		schema: (value) => value || './data'
	},
	OPENROUTER_API_KEY: {
		description: 'Only needed for "Mit KI ausfüllen"',
		schema: (value) => value ?? ''
	},
	OPENROUTER_MODEL: {
		description: 'OpenRouter model id; must accept image input and support structured output',
		schema: (value) => value ?? ''
	}
});
