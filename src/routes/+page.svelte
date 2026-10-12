<script lang="ts">
	import { resolve } from '$app/paths';
	import { getIsAdmin } from '#lib/auth.remote.js';
	import Icon from '#lib/components/Icon.svelte';
	import PlantCard from '#lib/components/PlantCard.svelte';
	import { currentSeason, SEASON_LABELS } from '#lib/plant.js';
	import { getPlants } from '#lib/plants.remote.js';

	const plants = $derived(await getPlants());
	const admin = $derived(await getIsAdmin());
	const season = currentSeason();

	let search = $state('');

	const needle = $derived(search.trim().toLocaleLowerCase('de'));
	const matches = $derived(
		plants.filter((plant) =>
			[plant.name, plant.commonName, plant.botanicalName, plant.location].some((value) =>
				value.toLocaleLowerCase('de').includes(needle)
			)
		)
	);
</script>

<svelte:head>
	<title>Floom: Pflege für meine Pflanzen</title>
	<meta
		name="description"
		content="Standort, Licht, Gießen und Tipps für jede Pflanze in der Wohnung und auf dem Balkon."
	/>
</svelte:head>

<header class="pt-4 sm:pt-10">
	<h1 class="schild text-[5.5rem] leading-[0.8] font-black font-stretch-62% sm:text-[9rem]">
		Floom
	</h1>
	<p class="mt-5 max-w-[30ch] text-lg leading-snug sm:text-xl">
		{#if plants.length === 1}
			Pflege für die eine Pflanze, die hier wohnt.
		{:else}
			Pflege für die {plants.length} Pflanzen in dieser Wohnung und auf dem Balkon.
		{/if}
	</p>
</header>

{#if plants.length === 0}
	<p class="mt-12 max-w-[40ch] text-lg">
		Noch ist keine Pflanze eingetragen.
		{#if admin}
			<a href={resolve('/import')} class="font-semibold underline underline-offset-2">
				Erste Pflanze hinzufügen
			</a>
		{/if}
	</p>
{:else}
	<div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
		<label class="relative block w-full max-w-md">
			<span class="sr-only">Pflanzen durchsuchen</span>
			<Icon
				name="suche"
				class="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-moos"
			/>
			<input
				type="search"
				bind:value={search}
				placeholder="Name, Art oder Standort"
				class="feld pl-10"
			/>
		</label>
		<p class="flex items-center gap-2 text-sm text-moos">
			<Icon name={season === 'summer' ? 'sonne' : 'frost'} class="size-5" />
			Gießangaben für den {SEASON_LABELS[season].name} ({SEASON_LABELS[season].months})
		</p>
	</div>

	{#if matches.length === 0}
		<p class="mt-12 text-lg">
			Keine Pflanze passt zu „{search.trim()}“.
			<button class="font-semibold underline underline-offset-2" onclick={() => (search = '')}>
				Suche leeren
			</button>
		</p>
	{:else}
		<ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
			{#each matches as plant (plant.id)}
				<li><PlantCard {plant} {season} /></li>
			{/each}
		</ul>
	{/if}
{/if}
