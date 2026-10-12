import { chat } from '@tanstack/ai';
import { createOpenRouterText } from '@tanstack/ai-openrouter';
import * as z from 'zod';
import { OPENROUTER_API_KEY, OPENROUTER_MODEL } from '$app/env/private';
import { careSchema, type CareSuggestion } from '../plant.ts';

const outputSchema = z.object({
	care: careSchema.nullable().meta({
		description: 'null, wenn auf dem Foto keine Pflanze zu erkennen ist'
	})
});

const SYSTEM_PROMPT = `Du bist ein erfahrener Gärtner für Zimmer- und Balkonpflanzen in Mitteleuropa.
Bestimme die Pflanze auf dem Foto und gib Pflegehinweise für genau diese Art.
Antworte ausschließlich auf Deutsch. Hinweise sind kurze, konkrete Sätze ohne Markdown.`;

export const aiConfigured = Boolean(OPENROUTER_API_KEY && OPENROUTER_MODEL);

/** @returns `null` if the model sees no plant in the photo */
export async function suggestCare(
	imageBase64: string,
	speciesHint: string
): Promise<CareSuggestion | null> {
	const { care } = await chat({
		adapter: createOpenRouterText(
			OPENROUTER_MODEL as Parameters<typeof createOpenRouterText>[0],
			OPENROUTER_API_KEY
		),
		systemPrompts: [SYSTEM_PROMPT],
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						content: speciesHint
							? `Laut Besitzer handelt es sich um: ${speciesHint}`
							: 'Welche Pflanze ist das und wie pflege ich sie?'
					},
					{ type: 'image', source: { type: 'data', value: imageBase64, mimeType: 'image/jpeg' } }
				]
			}
		],
		outputSchema
	});
	return care;
}
