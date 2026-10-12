<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getIsAdmin, logout } from '#lib/auth.remote.js';
	import Icon from '#lib/components/Icon.svelte';

	let { children } = $props();

	const admin = $derived(await getIsAdmin());
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 sm:px-8">
	<nav class="flex min-h-16 items-center justify-between gap-4 py-2" aria-label="Seite">
		{#if page.route.id === '/'}
			<span></span>
		{:else}
			<a href={resolve('/')} class="name text-3xl text-leaf hover:text-ink">Floom</a>
		{/if}
		{#if admin && page.route.id !== '/import'}
			<a href={resolve('/import')} class="button">
				<Icon name="plus" class="size-5" />
				Pflanze hinzufügen
			</a>
		{/if}
	</nav>

	<main class="flex-1 pb-20">
		{@render children()}
	</main>

	<footer
		class="flex items-center gap-4 border-t-2 border-dotted border-line py-6 text-sm text-moss"
	>
		{#if admin}
			<form {...logout}>
				<button class="link">Abmelden</button>
			</form>
		{:else}
			<a href={resolve('/login')} class="link">Anmelden</a>
		{/if}
	</footer>
</div>
