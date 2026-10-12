<script lang="ts">
	import { login } from '#lib/auth.remote.js';
</script>

<svelte:head><title>Anmelden – Floom</title></svelte:head>

<form {...login} class="mx-auto mt-8 max-w-sm">
	<h1 class="schild text-5xl">Anmelden</h1>
	<p class="mt-3 text-moos">Nur nötig, um Pflanzen hinzuzufügen oder zu ändern.</p>

	<label class="mt-8 block">
		<span class="text-sm font-semibold">Passwort</span>
		<input
			{...login.fields._password.as('password')}
			autocomplete="current-password"
			class="feld mt-1"
		/>
	</label>
	{#each login.fields.allIssues() ?? [] as issue (issue.message)}
		<p role="alert" class="mt-2 text-sm font-semibold text-gift">{issue.message}</p>
	{/each}

	<button class="knopf mt-6 w-full" disabled={login.pending > 0}>Anmelden</button>
</form>
