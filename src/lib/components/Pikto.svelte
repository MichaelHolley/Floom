<script lang="ts" module>
	const TONES = {
		sonne: 'bg-sonne text-tinte',
		hell: 'bg-[#ffe7a3] text-tinte',
		halbschatten: 'bg-[#c9dab0] text-tinte',
		schatten: 'bg-moos text-etikett',
		wasser: 'bg-wasser text-etikett',
		gift: 'bg-gift text-etikett',
		neutral: 'bg-etikett text-tinte ring-2 ring-linie ring-inset'
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
