<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head><title>Floom</title></svelte:head>

<div class="mt-8 max-w-md">
	<h1 class="schild text-5xl">
		{page.status === 404 ? 'Hier wächst nichts.' : 'Das hat nicht geklappt.'}
	</h1>
	<p class="mt-4 text-lg leading-relaxed">
		{page.status === 404
			? 'Diese Seite oder Pflanze gibt es nicht (mehr).'
			: 'Die Seite konnte nicht geladen werden. Bitte später noch einmal versuchen.'}
	</p>
	<a href={resolve('/')} class="knopf mt-6">Alle Pflanzen ansehen</a>
</div>
