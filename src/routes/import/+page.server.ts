import { redirect } from '@sveltejs/kit';
import { isAdmin } from '#lib/server/auth.js';

export function load() {
	if (!isAdmin()) redirect(303, '/login');
}
