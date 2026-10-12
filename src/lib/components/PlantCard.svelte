<script lang="ts">
	import { resolve } from '$app/paths';
	import { DIFFICULTY_LABELS, formatDays, LIGHT_LABELS, photoUrl, type Season } from '../plant.ts';
	import type { Plant } from '../server/db/schema.ts';
	import Icon from './Icon.svelte';
	import Pictogram from './Pictogram.svelte';

	type Summary = Pick<
		Plant,
		| 'id'
		| 'photo'
		| 'name'
		| 'location'
		| 'commonName'
		| 'botanicalName'
		| 'light'
		| 'wateringSummerMin'
		| 'wateringSummerMax'
		| 'wateringWinterMin'
		| 'wateringWinterMax'
		| 'toxicPets'
		| 'toxicChildren'
		| 'difficulty'
	>;

	let { plant, season }: { plant: Summary; season: Season } = $props();

	const watering = $derived(
		season === 'summer'
			? formatDays(plant.wateringSummerMin, plant.wateringSummerMax)
			: formatDays(plant.wateringWinterMin, plant.wateringWinterMax)
	);
</script>

<a href={resolve('/plants/[id=integer]', { id: plant.id })} class="group block">
	<div class="leaf-shape sway relative aspect-4/5 overflow-hidden bg-line">
		<img
			src={photoUrl(plant.photo, 'thumb')}
			alt=""
			loading="lazy"
			decoding="async"
			class="size-full object-cover"
		/>
		<span
			class="absolute bottom-2 left-2 rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold"
		>
			<span class="sr-only">Schwierigkeit:</span>
			{DIFFICULTY_LABELS[plant.difficulty]}
		</span>
		{#if plant.toxicPets || plant.toxicChildren}
			<span class="absolute top-2 right-2 flex">
				<Pictogram name="warning" tone="danger" class="size-6" />
				<span class="sr-only">Giftig</span>
			</span>
		{/if}
	</div>

	<h2 class="name mt-4 text-2xl group-hover:text-leaf sm:text-3xl">
		{plant.name}
	</h2>
	<p class="mt-1 text-sm leading-snug text-moss">
		{plant.commonName}
		<span class="latin text-base">{plant.botanicalName}</span>
	</p>

	<ul class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-medium">
		<li class="flex w-full items-center gap-1.5">
			<Icon name="location" class="size-5 text-moss" />
			{plant.location}
		</li>
		<li class="flex items-center gap-1.5">
			<Pictogram name={plant.light} tone={plant.light} />
			{LIGHT_LABELS[plant.light].short}
		</li>
		<li class="flex items-center gap-1.5">
			<Pictogram name="drop" tone="water" />
			<span class="sr-only">Gießen alle</span>
			{watering}
		</li>
	</ul>
</a>
