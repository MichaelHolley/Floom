import { readFile } from 'node:fs/promises';
import { error } from '@sveltejs/kit';
import { photoFile } from '#lib/server/photos.js';
import type { RequestHandler } from './$types';

const FILE = /^([0-9a-f-]{36})(\.thumb)?\.webp$/;

export const GET: RequestHandler = async ({ params }) => {
	const match = FILE.exec(params.file);
	if (!match) error(404, 'Not Found');
	const [, photo, thumb] = match;
	const body = await readFile(photoFile(photo, thumb ? 'thumb' : 'full')).catch(() =>
		error(404, 'Not Found')
	);
	return new Response(body, {
		headers: {
			'content-type': 'image/webp',
			// a replaced photo gets a new name, so a stored one never changes
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
};
