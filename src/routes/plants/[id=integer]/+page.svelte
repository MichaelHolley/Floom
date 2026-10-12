<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getIsAdmin } from '#lib/auth.remote.js';
	import CareRow from '#lib/components/CareRow.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import PlantFields from '#lib/components/PlantFields.svelte';
	import {
		currentSeason,
		formatDays,
		LIGHT_LABELS,
		photoUrl,
		SEASON_LABELS,
		type Season
	} from '#lib/plant.js';
	import { deletePlant, getPlant, updatePlant } from '#lib/plants.remote.js';

	let { params } = $props();

	const plant = $derived(await getPlant(params.id));
	const admin = $derived(await getIsAdmin());
	const edit = $derived(updatePlant.for(plant.id));
	const season = currentSeason();

	let editingId = $state<number>();
	const editing = $derived(admin && editingId === plant.id);

	let deleteDialog = $state<HTMLDialogElement>();
	let deleting = $state(false);

	const toxic = $derived(plant.toxicPets || plant.toxicChildren);

	async function remove() {
		deleting = true;
		try {
			await deletePlant(plant.id);
			await goto(resolve('/'));
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head><title>{plant.name} – Floom</title></svelte:head>

{#snippet seasonBox(key: Season, min: number | null, max: number | null)}
	<div
		class={[
			'rounded-2xl px-3.5 py-2.5',
			key === season ? 'bg-sonne' : 'bg-etikett ring-2 ring-linie ring-inset'
		]}
	>
		<p class="flex items-center justify-between gap-2 text-sm font-semibold">
			{SEASON_LABELS[key].name}
			{#if key === season}<span
					class="rounded-full bg-tinte px-2 py-0.5 text-xs font-semibold text-etikett">jetzt</span
				>{/if}
		</p>
		<p class="wert mt-1">
			{#if min !== null && max !== null}
				alle {formatDays(min, max)}
			{:else}
				Pause
			{/if}
		</p>
	</div>
{/snippet}

<p class="mb-5">
	<a
		href={resolve('/')}
		class="inline-flex items-center gap-1 text-sm font-semibold text-moos hover:text-tinte"
	>
		<Icon name="zurueck" class="size-5" />
		Alle Pflanzen
	</a>
</p>

<article class="grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
	<img
		src={photoUrl(plant.photo, 'full')}
		alt="Foto von {plant.name}"
		class="blattform aspect-4/5 w-full bg-linie object-cover lg:sticky lg:top-6"
	/>

	{#if editing}
		<form
			{...edit.enhance(async (form) => {
				if (await form.submit()) editingId = undefined;
			})}
			enctype="multipart/form-data"
		>
			<h1 class="titel text-3xl sm:text-4xl"><span class="name">{plant.name}</span> bearbeiten</h1>

			<input {...edit.fields.id.as('hidden', plant.id)} />

			<label class="mt-8 block">
				<span class="text-sm font-semibold">Foto ersetzen</span>
				<input
					{...edit.fields.photo.as('file')}
					accept="image/*"
					class="feld mt-1 file:mr-3 file:rounded-full file:border-0 file:bg-tinte file:px-3 file:py-1 file:font-semibold file:text-etikett"
				/>
				{#each edit.fields.photo.issues() ?? [] as issue (issue.message)}
					<p class="mt-1 text-sm font-semibold text-gift">{issue.message}</p>
				{/each}
			</label>

			<div class="mt-10">
				<PlantFields fields={edit.fields} {plant} />
			</div>

			<div
				class="mt-10 flex flex-wrap items-center gap-3 border-t-2 border-dotted border-linie pt-6"
			>
				<button class="knopf" disabled={edit.pending > 0}>Änderungen speichern</button>
				<button type="reset" class="knopf knopf-leise" onclick={() => (editingId = undefined)}>
					Abbrechen
				</button>
				<button
					type="button"
					class="ml-auto font-semibold text-gift underline decoration-wavy underline-offset-4"
					onclick={() => deleteDialog?.showModal()}
				>
					Pflanze löschen
				</button>
			</div>
		</form>

		<dialog
			bind:this={deleteDialog}
			class="m-auto max-w-sm rounded-3xl bg-etikett p-6 text-tinte backdrop:bg-tinte/60"
		>
			<h2 class="titel text-2xl"><span class="name">{plant.name}</span> löschen?</h2>
			<p class="mt-3 leading-relaxed">
				Die Pflanze und ihr Foto werden endgültig entfernt. Das lässt sich nicht rückgängig machen.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<button class="knopf knopf-gift" disabled={deleting} onclick={remove}>
					Pflanze löschen
				</button>
				<button class="knopf knopf-leise" onclick={() => deleteDialog?.close()}>Behalten</button>
			</div>
		</dialog>
	{:else}
		<div>
			<div class="flex items-start justify-between gap-4">
				<h1 class="name text-5xl sm:text-6xl">{plant.name}</h1>
				{#if admin}
					<button class="knopf knopf-leise shrink-0" onclick={() => (editingId = plant.id)}>
						<Icon name="stift" class="size-5" />
						Bearbeiten
					</button>
				{/if}
			</div>
			<p class="mt-3 text-xl leading-snug">
				{plant.commonName}
				<span class="latin text-2xl text-moos">{plant.botanicalName}</span>
			</p>
			<p class="mt-4 flex items-center gap-2 font-medium">
				<Icon name="ort" class="size-5 text-moos" />
				{plant.location}
			</p>

			<h2 class="titel mt-12 text-2xl">Pflege</h2>
			<dl class="mt-4 border-t-2 border-dotted border-linie">
				<CareRow icon={plant.light} tone={plant.light} label="Licht">
					<p class="wert">{LIGHT_LABELS[plant.light].long}</p>
				</CareRow>

				<CareRow icon="tropfen" tone="wasser" label="Gießen" note={plant.wateringNote}>
					<div class="grid max-w-md grid-cols-2 gap-2">
						{@render seasonBox('summer', plant.wateringSummerMin, plant.wateringSummerMax)}
						{@render seasonBox('winter', plant.wateringWinterMin, plant.wateringWinterMax)}
					</div>
				</CareRow>

				<CareRow icon="duenger" label="Düngen" note={plant.fertilizingNote}>
					<div class="grid max-w-md grid-cols-2 gap-2">
						{@render seasonBox('summer', plant.fertilizingSummerMin, plant.fertilizingSummerMax)}
						{@render seasonBox('winter', plant.fertilizingWinterMin, plant.fertilizingWinterMax)}
					</div>
				</CareRow>

				{#if plant.substrate}
					<CareRow icon="substrat" label="Substrat">
						<p class="max-w-[60ch] leading-relaxed">{plant.substrate}</p>
					</CareRow>
				{/if}

				<CareRow icon="topf" label="Umtopfen" note={plant.repottingNote}>
					<p class="wert">
						{plant.repottingYears === 1 ? 'jedes Jahr' : `alle ${plant.repottingYears} Jahre`}
					</p>
				</CareRow>

				<CareRow
					icon="warnung"
					tone={toxic ? 'gift' : 'neutral'}
					label="Giftigkeit"
					note={plant.toxicityNote}
				>
					<p class="wert">
						{#if plant.toxicPets && plant.toxicChildren}
							Giftig für Haustiere und Kinder
						{:else if plant.toxicPets}
							Giftig für Haustiere
						{:else if plant.toxicChildren}
							Giftig für Kinder
						{:else}
							Ungiftig
						{/if}
					</p>
				</CareRow>

				<CareRow icon="stufen" label="Schwierigkeit">
					<p class="wert first-letter:uppercase">{plant.difficulty}</p>
				</CareRow>

				{#if plant.frostMinTemp !== null || plant.overwinteringNote}
					<CareRow icon="frost" label="Frost und Überwinterung" note={plant.overwinteringNote}>
						{#if plant.frostMinTemp !== null}
							<p class="wert">
								Verträgt bis {plant.frostMinTemp.toLocaleString('de').replace('-', '−')} °C
							</p>
						{/if}
					</CareRow>
				{/if}
			</dl>

			{#if plant.tips}
				<h2 class="titel mt-12 text-2xl">Tipps und Tricks</h2>
				<p class="mt-4 max-w-[62ch] text-lg leading-relaxed whitespace-pre-line">{plant.tips}</p>
			{/if}
		</div>
	{/if}
</article>
