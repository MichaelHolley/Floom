import * as z from 'zod';

z.config(z.locales.de());

export const LIGHT_LEVELS = ['sonne', 'hell', 'halbschatten', 'schatten'] as const;
export type Light = (typeof LIGHT_LEVELS)[number];

export const LIGHT_LABELS: Record<Light, { long: string; short: string }> = {
	sonne: { long: 'Volle Sonne', short: 'Sonne' },
	hell: { long: 'Hell, indirekt', short: 'Hell' },
	halbschatten: { long: 'Halbschatten', short: 'Halbschatten' },
	schatten: { long: 'Schatten', short: 'Schatten' }
};

export const DIFFICULTIES = ['einfach', 'mittel', 'schwer'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

const note = z.string().trim().max(500).default('');
const days = z.number().int().min(1).max(365);

const careShape = {
	commonName: z.string().trim().min(1).max(80).meta({ description: 'Deutscher Name der Art' }),
	botanicalName: z.string().trim().min(1).max(80).meta({ description: 'Botanischer Name' }),
	light: z.enum(LIGHT_LEVELS).meta({
		description: 'sonne = volle Sonne, hell = hell ohne direkte Sonne'
	}),
	wateringSummerMin: days.meta({ description: 'Gießabstand im Sommer in Tagen, untere Grenze' }),
	wateringSummerMax: days,
	wateringWinterMin: days.meta({ description: 'Gießabstand im Winter in Tagen, untere Grenze' }),
	wateringWinterMax: days,
	wateringNote: note,
	fertilizingSummerMin: days.meta({ description: 'Düngeabstand im Sommer in Tagen' }),
	fertilizingSummerMax: days,
	fertilizingWinterMin: days.optional().meta({
		description: 'Düngeabstand im Winter in Tagen; leer lassen, wenn im Winter nicht gedüngt wird'
	}),
	fertilizingWinterMax: days.optional(),
	fertilizingNote: note,
	substrate: z.string().trim().max(200).default(''),
	repottingYears: z.number().int().min(1).max(20).meta({ description: 'Umtopfen alle … Jahre' }),
	repottingNote: note,
	toxicPets: z.boolean().default(false),
	toxicChildren: z.boolean().default(false),
	toxicityNote: note,
	difficulty: z.enum(DIFFICULTIES),
	frostMinTemp: z.number().int().min(-50).max(30).optional().meta({
		description: 'Tiefste vertragene Temperatur in °C; leer lassen, wenn unbekannt'
	}),
	overwinteringNote: note,
	tips: z.string().trim().max(4000).default('').meta({
		description: 'Tipps und Tricks als reiner Text mit Zeilenumbrüchen, kein Markdown'
	})
};

export const plantShape = {
	name: z.string().trim().min(1).max(60),
	location: z.string().trim().min(1).max(80),
	...careShape
};

const RANGES = [
	['wateringSummerMin', 'wateringSummerMax'],
	['wateringWinterMin', 'wateringWinterMax'],
	['fertilizingSummerMin', 'fertilizingSummerMax'],
	['fertilizingWinterMin', 'fertilizingWinterMax']
] as const;

type RangeValues = Partial<Record<(typeof RANGES)[number][number], number>>;

export function checkRanges(value: RangeValues, ctx: z.RefinementCtx) {
	for (const [minKey, maxKey] of RANGES) {
		const min = value[minKey];
		const max = value[maxKey];
		if ((min === undefined) !== (max === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: [min === undefined ? minKey : maxKey],
				message: 'Bitte beide Werte angeben oder beide leer lassen'
			});
		} else if (min !== undefined && max !== undefined && min > max) {
			ctx.addIssue({
				code: 'custom',
				path: [maxKey],
				message: 'Darf nicht kleiner sein als der erste Wert'
			});
		}
	}
}

export const careSchema = z.object(careShape);
export const plantSchema = z.object(plantShape).superRefine(checkRanges);

export type PlantInput = z.input<typeof plantSchema>;
export type CareSuggestion = z.input<typeof careSchema>;

export type Season = 'summer' | 'winter';

export const SEASON_LABELS: Record<Season, { name: string; months: string }> = {
	summer: { name: 'Sommer', months: 'April bis September' },
	winter: { name: 'Winter', months: 'Oktober bis März' }
};

export function currentSeason(date = new Date()): Season {
	const month = date.getMonth();
	return month >= 3 && month <= 8 ? 'summer' : 'winter';
}

export function formatDays(min: number, max: number) {
	if (min === max) return min === 1 ? '1 Tag' : `${min} Tage`;
	return `${min}–${max} Tage`;
}

export function photoUrl(photo: string, size: 'full' | 'thumb') {
	return `/photos/${photo}${size === 'thumb' ? '.thumb' : ''}.webp`;
}
