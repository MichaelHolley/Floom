<script lang="ts">
	import { login } from '#lib/auth.remote.js';
</script>

<svelte:head><title>Anmelden – Floom</title></svelte:head>

<form {...login} class="mx-auto mt-8 max-w-sm">
	<h1 class="title text-4xl">Anmelden</h1>
	<p class="mt-3 text-moss">Nur nötig, um Pflanzen hinzuzufügen oder zu ändern.</p>

	<label class="mt-8 block">
		<span class="text-sm font-semibold">Passwort</span>
		<input
			{...login.fields._password.as('password')}
			autocomplete="current-password"
			class="field mt-1"
		/>
	</label>
	{#each login.fields.allIssues() ?? [] as issue (issue.message)}
		<p role="alert" class="mt-2 text-sm font-semibold text-danger">{issue.message}</p>
	{/each}

	<button class="button mt-6 w-full" disabled={login.pending > 0}>Anmelden</button>
</form>
