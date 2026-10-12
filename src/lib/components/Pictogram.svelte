<script lang="ts" module>
	const TONES = {
		sun: 'bg-sun text-ink',
		bright: 'bg-[#ffe7a3] text-ink',
		partialShade: 'bg-[#c9dab0] text-ink',
		shade: 'bg-moss text-surface',
		water: 'bg-water text-surface',
		danger: 'bg-danger text-surface',
		neutral: 'bg-surface text-ink ring-2 ring-line ring-inset'
	};

	export type Tone = keyof typeof TONES;
</script>

<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import Icon, { type IconName } from './Icon.svelte';

	let {
		name,
		tone = 'neutral',
		class: className = 'size-6'
	}: { name: IconName; tone?: Tone; class?: ClassValue } = $props();
</script>

<span class={['inline-grid shrink-0 place-items-center rounded-full', TONES[tone], className]}>
	<Icon {name} class="size-[66%]" />
</span>
