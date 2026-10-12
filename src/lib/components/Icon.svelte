<script lang="ts" module>
	const RAYS =
		'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4';
	const DISC = 'M12 5a7 7 0 1 0 0 14a7 7 0 0 0 0-14Z';

	const ICONS = {
		sonne: { fill: 'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8Z', stroke: RAYS },
		hell: { stroke: `M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8Z${RAYS}` },
		halbschatten: { fill: 'M12 5a7 7 0 0 0 0 14Z', stroke: DISC },
		schatten: { fill: DISC, stroke: DISC },
		tropfen: { stroke: 'M12 3c3.5 4.2 6 7.3 6 10.5a6 6 0 0 1-12 0C6 10.3 8.5 7.2 12 3Z' },
		ort: {
			stroke:
				'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11ZM12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z'
		},
		warnung: { stroke: 'M12 3.5 2.5 20h19L12 3.5ZM12 10v4.5M12 17.4v.1' },
		duenger: {
			stroke:
				'M9.5 3h5M10.5 3v5.5L5 18.5A1.7 1.7 0 0 0 6.5 21h11a1.7 1.7 0 0 0 1.5-2.5L13.5 8.5V3M7.6 15h8.8'
		},
		substrat: { stroke: 'M12 3 3 8l9 5 9-5-9-5ZM3 12.5l9 5 9-5M3 17l9 5 9-5' },
		topf: { stroke: 'M5.5 10h13L17 20.5H7L5.5 10ZM4 6.5h16V10H4V6.5Z' },
		stufen: { stroke: 'M5 20v-4M12 20v-9M19 20V5' },
		frost: {
			stroke: 'M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5'
		},
		suche: { stroke: 'M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13ZM15.5 15.5 20 20' },
		plus: { stroke: 'M12 5v14M5 12h14' },
		zurueck: { stroke: 'M14.5 5.5 8 12l6.5 6.5' },
		kamera: {
			stroke: 'M4 8h3.2l1.6-2.5h6.4L16.8 8H20v11H4V8ZM12 10.5a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z'
		},
		stift: { stroke: 'M4 20l1-4.5L16.5 4 20 7.5 8.5 19 4 20ZM14 6.5l3.5 3.5' }
	} satisfies Record<string, { fill?: string; stroke?: string }>;

	export type IconName = keyof typeof ICONS;
</script>

<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let { name, class: className }: { name: IconName; class?: ClassValue } = $props();

	const icon: { fill?: string; stroke?: string } = $derived(ICONS[name]);
</script>

<svg viewBox="0 0 24 24" class={['shrink-0', className]} aria-hidden="true">
	{#if icon.fill}
		<path d={icon.fill} fill="currentColor" />
	{/if}
	{#if icon.stroke}
		<path
			d={icon.stroke}
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}
</svg>
