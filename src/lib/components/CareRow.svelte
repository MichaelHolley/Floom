<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconName } from './Icon.svelte';
	import Pictogram, { type Tone } from './Pictogram.svelte';

	let {
		icon,
		tone,
		label,
		note,
		children
	}: { icon: IconName; tone?: Tone; label: string; note?: string; children: Snippet } = $props();
</script>

<div
	class="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b-2 border-dotted border-line py-5"
>
	<Pictogram name={icon} {tone} class="size-11" />
	<div>
		<dt class="text-sm font-semibold text-moss">{label}</dt>
		<dd class="mt-1">
			{@render children()}
			{#if note}
				<p class="mt-2 max-w-[60ch] leading-relaxed">{note}</p>
			{/if}
		</dd>
	</div>
</div>
