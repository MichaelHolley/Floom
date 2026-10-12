import { error, invalid, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import * as z from 'zod';
import { command, form, query } from '$app/server';
import { checkRanges, plantShape, plantSchema } from './plant.ts';
import { aiConfigured, suggestCare } from './server/ai.ts';
import { requireAdmin } from './server/auth.ts';
import { db } from './server/db/index.ts';
import { plants } from './server/db/schema.ts';
import { removePhoto, storePhoto } from './server/photos.ts';

const MAX_PHOTO_BYTES = 25 * 1024 * 1024;
const UNREADABLE_PHOTO = 'Die Datei ist kein lesbares Bild. Bitte JPEG, PNG oder WebP wählen.';

const plantId = z.number().int().positive();
const photo = z.file().max(MAX_PHOTO_BYTES);

const createSchema = z
	.object({ ...plantShape, photo: photo.min(1, 'Bitte ein Foto auswählen') })
	.superRefine(checkRanges);

const updateSchema = z
	.object({ ...plantShape, id: plantId, photo: photo.optional() })
	.superRefine(checkRanges);

function toRow(data: z.output<typeof plantSchema>) {
	return {
		...data,
		fertilizingWinterMin: data.fertilizingWinterMin ?? null,
		fertilizingWinterMax: data.fertilizingWinterMax ?? null,
		frostMinTemp: data.frostMinTemp ?? null
	};
}

export const getPlants = query(() =>
	db
		.select({
			id: plants.id,
			photo: plants.photo,
			name: plants.name,
			location: plants.location,
			commonName: plants.commonName,
			botanicalName: plants.botanicalName,
			light: plants.light,
			wateringSummerMin: plants.wateringSummerMin,
			wateringSummerMax: plants.wateringSummerMax,
			wateringWinterMin: plants.wateringWinterMin,
			wateringWinterMax: plants.wateringWinterMax,
			toxicPets: plants.toxicPets,
			toxicChildren: plants.toxicChildren,
			difficulty: plants.difficulty
		})
		.from(plants)
		.orderBy(sql`${plants.name} collate nocase`)
		.all()
);

export const getPlant = query(plantId, (id) => {
	const plant = db.select().from(plants).where(eq(plants.id, id)).get();
	if (!plant) error(404, 'Diese Pflanze gibt es nicht.');
	return plant;
});

export const createPlant = form(createSchema, async ({ photo, ...data }, issue) => {
	requireAdmin();
	const stored = await storePhoto(photo).catch(() => invalid(issue.photo(UNREADABLE_PHOTO)));
	const { id } = db
		.insert(plants)
		.values({ ...toRow(data), photo: stored })
		.returning({ id: plants.id })
		.get();
	redirect(303, `/plants/${id}`);
});

export const updatePlant = form(updateSchema, async ({ id, photo, ...data }, issue) => {
	requireAdmin();
	const existing = db.select({ photo: plants.photo }).from(plants).where(eq(plants.id, id)).get();
	if (!existing) error(404, 'Diese Pflanze gibt es nicht.');

	const replacement = photo?.size
		? await storePhoto(photo).catch(() => invalid(issue.photo(UNREADABLE_PHOTO)))
		: undefined;
	db.update(plants)
		.set({ ...toRow(data), photo: replacement ?? existing.photo })
		.where(eq(plants.id, id))
		.run();
	if (replacement) await removePhoto(existing.photo);
});

export const deletePlant = command(plantId, async (id) => {
	requireAdmin();
	const deleted = db
		.delete(plants)
		.where(eq(plants.id, id))
		.returning({ photo: plants.photo })
		.get();
	if (deleted) await removePhoto(deleted.photo);
});

export const suggestPlant = command(
	z.object({ image: z.string().max(4_000_000), hint: z.string().trim().max(100) }),
	async ({ image, hint }) => {
		requireAdmin();
		if (!aiConfigured) {
			return { error: 'Die KI ist nicht eingerichtet. Bitte die Angaben von Hand eintragen.' };
		}
		try {
			const care = await suggestCare(image, hint);
			if (!care) {
				return { error: 'Auf dem Foto ist keine Pflanze zu erkennen. Bitte von Hand eintragen.' };
			}
			return { care };
		} catch (cause) {
			console.error('AI suggestion failed', cause);
			return { error: 'Die KI hat nicht geantwortet. Bitte die Angaben von Hand eintragen.' };
		}
	}
);
