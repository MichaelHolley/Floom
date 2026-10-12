<script lang="ts">
	import type { RemoteFormField, RemoteFormFields, RemoteFormIssue } from '$app/server';
	import { DIFFICULTIES, LIGHT_LABELS, LIGHT_LEVELS, type PlantInput } from '../plant.ts';
	import type { Plant } from '../server/db/schema.ts';
	import Pikto from './Pikto.svelte';

	let { fields, plant }: { fields: RemoteFormFields<PlantInput>; plant?: Plant } = $props();

	const choice =
		'flex min-h-11 items-center gap-2.5 rounded-2xl border-2 border-linie bg-etikett px-3 py-2 font-medium has-checked:border-tinte has-checked:bg-sonne/30 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-wasser';
</script>

{#snippet issues(field: { issues(): RemoteFormIssue[] | undefined })}
	{#each field.issues() ?? [] as issue (issue.message)}
		<p class="mt-1 text-sm font-semibold text-gift">{issue.message}</p>
	{/each}
{/snippet}

{#snippet text(label: string, field: RemoteFormField<string>, value?: string, placeholder?: string)}
	<label class="block">
		<span class="text-sm font-semibold">{label}</span>
		<input {...field.as('text', value)} {placeholder} class="feld mt-1" />
		{@render issues(field)}
	</label>
{/snippet}

{#snippet note(label: string, field: RemoteFormField<string>, value?: string)}
	<label class="block">
		<span class="text-sm font-semibold">{label}</span>
		<textarea {...field.as('text', value)} rows="2" class="feld mt-1"></textarea>
		{@render issues(field)}
	</label>
{/snippet}

{#snippet days(
	activity: string,
	season: string,
	min: RemoteFormField<number>,
	max: RemoteFormField<number>,
	minValue?: number | null,
	maxValue?: number | null
)}
	<div>
		<span class="text-sm font-semibold">{season}</span>
		<div class="mt-1 flex items-center gap-2">
			alle
			<input
				{...min.as('number', minValue ?? undefined)}
				aria-label="{activity} im {season}, frühestens nach wie vielen Tagen"
				min="1"
				class="feld w-20"
			/>
			bis
			<input
				{...max.as('number', maxValue ?? undefined)}
				aria-label="{activity} im {season}, spätestens nach wie vielen Tagen"
				min="1"
				class="feld w-20"
			/>
			Tage
		</div>
		{@render issues(min)}
		{@render issues(max)}
	</div>
{/snippet}

<div class="grid gap-10">
	<fieldset class="grid gap-4 sm:grid-cols-2">
		<legend class="titel mb-4 text-xl">Diese Pflanze</legend>
		{@render text('Name', fields.name, plant?.name, 'Große Monstera')}
		{@render text('Standort', fields.location, plant?.location, 'Wohnzimmer, Ostfenster')}
	</fieldset>

	<fieldset class="grid gap-4 sm:grid-cols-2">
		<legend class="titel mb-4 text-xl">Art</legend>
		{@render text('Deutscher Name', fields.commonName, plant?.commonName, 'Fensterblatt')}
		{@render text(
			'Botanischer Name',
			fields.botanicalName,
			plant?.botanicalName,
			'Monstera deliciosa'
		)}
	</fieldset>

	<fieldset>
		<legend class="titel mb-4 text-xl">Licht</legend>
		<div class="grid gap-2 sm:grid-cols-2">
			{#each LIGHT_LEVELS as level (level)}
				<label class={choice}>
					<input
						{...fields.light.as('radio', level, plant ? plant.light === level : undefined)}
						class="sr-only"
					/>
					<Pikto name={level} tone={level} class="size-7" />
					{LIGHT_LABELS[level].long}
				</label>
			{/each}
		</div>
		{@render issues(fields.light)}
	</fieldset>

	<fieldset class="grid gap-4">
		<legend class="titel mb-4 text-xl">Gießen</legend>
		<div class="grid gap-4 sm:grid-cols-2">
			{@render days(
				'Gießen',
				'Sommer',
				fields.wateringSummerMin,
				fields.wateringSummerMax,
				plant?.wateringSummerMin,
				plant?.wateringSummerMax
			)}
			{@render days(
				'Gießen',
				'Winter',
				fields.wateringWinterMin,
				fields.wateringWinterMax,
				plant?.wateringWinterMin,
				plant?.wateringWinterMax
			)}
		</div>
		{@render note('Hinweis zum Gießen', fields.wateringNote, plant?.wateringNote)}
	</fieldset>

	<fieldset class="grid gap-4">
		<legend class="titel mb-4 text-xl">Düngen</legend>
		<div class="grid gap-4 sm:grid-cols-2">
			{@render days(
				'Düngen',
				'Sommer',
				fields.fertilizingSummerMin,
				fields.fertilizingSummerMax,
				plant?.fertilizingSummerMin,
				plant?.fertilizingSummerMax
			)}
			{@render days(
				'Düngen',
				'Winter',
				fields.fertilizingWinterMin,
				fields.fertilizingWinterMax,
				plant?.fertilizingWinterMin,
				plant?.fertilizingWinterMax
			)}
		</div>
		<p class="text-sm text-moos">Winter leer lassen, wenn dann nicht gedüngt wird.</p>
		{@render note('Hinweis zum Düngen', fields.fertilizingNote, plant?.fertilizingNote)}
	</fieldset>

	<fieldset class="grid gap-4">
		<legend class="titel mb-4 text-xl">Substrat und Umtopfen</legend>
		{@render text(
			'Substrat',
			fields.substrate,
			plant?.substrate,
			'Lockere Grünpflanzenerde mit Perlit'
		)}
		<label class="block">
			<span class="text-sm font-semibold">Umtopfen</span>
			<span class="mt-1 flex items-center gap-2">
				alle
				<input
					{...fields.repottingYears.as('number', plant?.repottingYears)}
					min="1"
					class="feld w-20"
				/>
				Jahre
			</span>
			{@render issues(fields.repottingYears)}
		</label>
		{@render note('Hinweis zum Umtopfen', fields.repottingNote, plant?.repottingNote)}
	</fieldset>

	<fieldset class="grid gap-4">
		<legend class="titel mb-4 text-xl">Giftigkeit</legend>
		<div class="grid gap-2 sm:grid-cols-2">
			<label class={choice}>
				<input {...fields.toxicPets.as('checkbox', plant?.toxicPets)} class="size-5 accent-gift" />
				Giftig für Haustiere
			</label>
			<label class={choice}>
				<input
					{...fields.toxicChildren.as('checkbox', plant?.toxicChildren)}
					class="size-5 accent-gift"
				/>
				Giftig für Kinder
			</label>
		</div>
		{@render note('Hinweis zur Giftigkeit', fields.toxicityNote, plant?.toxicityNote)}
	</fieldset>

	<fieldset>
		<legend class="titel mb-4 text-xl">Schwierigkeit</legend>
		<div class="grid grid-cols-3 gap-2">
			{#each DIFFICULTIES as difficulty (difficulty)}
				<label class={[choice, 'justify-center']}>
					<input
						{...fields.difficulty.as(
							'radio',
							difficulty,
							plant ? plant.difficulty === difficulty : undefined
						)}
						class="sr-only"
					/>
					{difficulty}
				</label>
			{/each}
		</div>
		{@render issues(fields.difficulty)}
	</fieldset>

	<fieldset class="grid gap-4">
		<legend class="titel mb-4 text-xl">Frost und Überwinterung</legend>
		<label class="block">
			<span class="text-sm font-semibold">Tiefste vertragene Temperatur</span>
			<span class="mt-1 flex items-center gap-2">
				<input
					{...fields.frostMinTemp.as('number', plant?.frostMinTemp ?? undefined)}
					class="feld w-24"
				/>
				°C
			</span>
			{@render issues(fields.frostMinTemp)}
		</label>
		{@render note('Überwinterung', fields.overwinteringNote, plant?.overwinteringNote)}
	</fieldset>

	<fieldset>
		<legend class="titel mb-4 text-xl">Tipps und Tricks</legend>
		<textarea
			{...fields.tips.as('text', plant?.tips)}
			rows="8"
			aria-label="Tipps und Tricks"
			class="feld leading-relaxed"></textarea>
		{@render issues(fields.tips)}
	</fieldset>
</div>
