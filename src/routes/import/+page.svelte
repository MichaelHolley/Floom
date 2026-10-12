<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import PlantFields from '#lib/components/PlantFields.svelte';
	import { toSmallJpegBase64 } from '#lib/downscale.js';
	import { createPlant, suggestPlant } from '#lib/plants.remote.js';

	const AI_UNREACHABLE = 'Die KI hat nicht geantwortet. Bitte die Angaben von Hand eintragen.';

	let photo = $state.raw<File>();
	const preview = $derived(photo && URL.createObjectURL(photo));

	let filling = $state(false);
	let speciesHint = $state('');
	let asking = $state(false);
	let aiError = $state('');

	async function fillWithAi() {
		if (!photo) return;
		asking = true;
		aiError = '';
		try {
			const result = await suggestPlant({
				image: await toSmallJpegBase64(photo),
				hint: speciesHint
			});
			if (result.care) {
				// the photo has to be part of the new values, otherwise setting them empties the file input
				createPlant.fields.set({ ...result.care, photo });
			} else {
				aiError = result.error;
			}
		} catch {
			aiError = AI_UNREACHABLE;
		}
		asking = false;
		filling = true;
	}
</script>

<svelte:head><title>Pflanze hinzufügen – Floom</title></svelte:head>

<form {...createPlant} enctype="multipart/form-data" class="mx-auto max-w-2xl">
	<h1 class="title text-4xl sm:text-5xl">Pflanze hinzufügen</h1>

	<label
		class="mt-8 grid aspect-4/3 w-full place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed border-leaf bg-surface has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-water"
	>
		{#if preview}
			<img src={preview} alt="Gewähltes Foto" class="size-full object-cover" />
		{:else}
			<span class="flex flex-col items-center gap-2 p-6 text-center font-semibold">
				<Icon name="camera" class="size-10" />
				Foto aufnehmen oder auswählen
			</span>
		{/if}
		<input
			{...createPlant.fields.photo.as('file')}
			accept="image/*"
			class="sr-only"
			onchange={(event) => (photo = event.currentTarget.files?.[0])}
		/>
	</label>
	{#if preview}
		<p class="mt-2 text-sm text-moss">Zum Ändern auf das Foto tippen.</p>
	{/if}
	{#each createPlant.fields.photo.issues() ?? [] as issue (issue.message)}
		<p class="mt-2 text-sm font-semibold text-danger">{issue.message}</p>
	{/each}

	{#if !filling}
		<div class="mt-8 grid gap-4">
			<label class="block">
				<span class="text-sm font-semibold">Art, falls bekannt</span>
				<input bind:value={speciesHint} placeholder="Monstera" maxlength="100" class="field mt-1" />
				<span class="mt-1 block text-sm text-moss">Hilft der KI beim Bestimmen.</span>
			</label>
			<div class="flex flex-wrap gap-3">
				<button type="button" class="button" disabled={!photo || asking} onclick={fillWithAi}>
					{asking ? 'KI füllt aus …' : 'Mit KI ausfüllen'}
				</button>
				<button
					type="button"
					class="button button-quiet"
					disabled={!photo || asking}
					onclick={() => (filling = true)}
				>
					Manuell ausfüllen
				</button>
			</div>
			{#if !photo}
				<p class="text-sm text-moss">Zuerst ein Foto wählen.</p>
			{/if}
		</div>
	{:else}
		{#if aiError}
			<p
				role="alert"
				class="mt-8 rounded-2xl border-2 border-danger bg-surface px-4 py-3 font-semibold"
			>
				{aiError}
			</p>
		{/if}

		<div class="mt-10">
			<PlantFields fields={createPlant.fields} />
		</div>

		<div class="mt-10 border-t-2 border-ink pt-6">
			<button class="button" disabled={createPlant.pending > 0}>Pflanze speichern</button>
			<p class="mt-3 text-sm text-moss">
				Erst nach dem Speichern ist die Pflanze öffentlich zu sehen.
			</p>
		</div>
	{/if}
</form>
