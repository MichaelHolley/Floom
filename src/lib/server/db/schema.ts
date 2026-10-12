import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DIFFICULTIES, LIGHT_LEVELS } from '../../plant.ts';

export const plants = sqliteTable('plants', {
	id: integer().primaryKey({ autoIncrement: true }),
	photo: text().notNull(),
	name: text().notNull(),
	location: text().notNull(),
	commonName: text().notNull(),
	botanicalName: text().notNull(),
	light: text({ enum: LIGHT_LEVELS }).notNull(),
	wateringSummerMin: integer().notNull(),
	wateringSummerMax: integer().notNull(),
	wateringWinterMin: integer().notNull(),
	wateringWinterMax: integer().notNull(),
	wateringNote: text().notNull(),
	fertilizingSummerMin: integer().notNull(),
	fertilizingSummerMax: integer().notNull(),
	fertilizingWinterMin: integer(),
	fertilizingWinterMax: integer(),
	fertilizingNote: text().notNull(),
	substrate: text().notNull(),
	repottingYears: integer().notNull(),
	repottingNote: text().notNull(),
	toxicPets: integer({ mode: 'boolean' }).notNull(),
	toxicChildren: integer({ mode: 'boolean' }).notNull(),
	toxicityNote: text().notNull(),
	difficulty: text({ enum: DIFFICULTIES }).notNull(),
	frostMinTemp: integer(),
	overwinteringNote: text().notNull(),
	tips: text().notNull()
});

export type Plant = typeof plants.$inferSelect;
