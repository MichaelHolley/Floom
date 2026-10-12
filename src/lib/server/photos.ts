import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { DATA_DIR } from '$app/env/private';

const SIZES = { full: 1600, thumb: 640 } as const;

const directory = join(DATA_DIR, 'photos');

export function photoFile(photo: string, size: keyof typeof SIZES) {
	return join(directory, size === 'thumb' ? `${photo}.thumb.webp` : `${photo}.webp`);
}

/**
 * Stores a resized WebP copy and a thumbnail. sharp drops all metadata on output,
 * which is what removes the EXIF location.
 * @throws if the file is not an image sharp can read
 */
export async function storePhoto(file: File) {
	mkdirSync(directory, { recursive: true });
	const photo = randomUUID();
	const source = sharp(await file.arrayBuffer()).rotate();
	await Promise.all(
		(Object.keys(SIZES) as (keyof typeof SIZES)[]).map((size) =>
			source
				.clone()
				.resize({
					width: SIZES[size],
					height: SIZES[size],
					fit: 'inside',
					withoutEnlargement: true
				})
				.webp({ quality: 80 })
				.toFile(photoFile(photo, size))
		)
	);
	return photo;
}

export async function removePhoto(photo: string) {
	await Promise.all([
		rm(photoFile(photo, 'full'), { force: true }),
		rm(photoFile(photo, 'thumb'), { force: true })
	]);
}
