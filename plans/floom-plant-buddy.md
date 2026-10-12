# Floom: plant buddy plan

Project: `E:\DEV\Floom` (SvelteKit 3 with runes and remote functions, TypeScript, Tailwind 4, pnpm).
Status: design agreed on 2026-10-11, nothing built yet.

## What Floom is

A public, German-language care guide for the plants I own, indoor and on the balcony.

- One card is one physical plant, not a species. Two Monsteras are two cards.
- Advice only: location, light, watering cycles, tips. No watering log, no due status, no reminders.
- Anyone with the URL can read everything, without an account.
- Exactly one superuser exists. Only the superuser can import, edit and delete.

## Plant properties

Care values are structured (fixed choice or number) with an optional short note for nuance.

| Property        | Shape                                                           | Where it shows                      | Filled by AI |
| --------------- | --------------------------------------------------------------- | ----------------------------------- | ------------ |
| Photo           | One image, replaceable                                          | Card hero, detail page              | no           |
| Name            | Text                                                            | Card title                          | no           |
| Species         | Common name + botanical name                                    | Card subtitle (botanical in italic) | yes          |
| Location        | Single free text, e.g. "Wohnzimmer, Ostfenster"                 | Card chip, searchable               | no           |
| Light           | 4 levels: volle Sonne / hell indirekt / Halbschatten / Schatten | Card chip, detail                   | yes          |
| Watering        | Day range for summer and for winter, plus note                  | Card chip (current season), detail  | yes          |
| Fertilizing     | Same pattern as watering; the winter range may be empty         | Detail                              | yes          |
| Substrate       | Text                                                            | Detail                              | yes          |
| Repotting       | Interval in years, plus note                                    | Detail                              | yes          |
| Toxicity        | Pets yes/no, children yes/no, plus note                         | Card badge, detail                  | yes          |
| Difficulty      | einfach / mittel / schwer                                       | Card badge, detail                  | yes          |
| Frost hardiness | Optional minimum temperature in °C, plus overwintering note     | Detail                              | yes          |
| Tips & tricks   | Plain text with line breaks (no Markdown)                       | Detail                              | yes          |

There is no separate indoor/outdoor flag. Balcony plants are covered by the frost hardiness value and the overwintering note.

## Screens

### `/` plant grid

- Photo-led cards, two columns on a phone, sorted by name.
- One search box matching name, species and location. No filter chips.

```
+----------------------+
|                      |
|        PHOTO         |
|                      |
+----------------------+
| Big Monstera         |
| Monstera deliciosa   |
|                      |
| [pin Wohnzimmer]     |
| [sun Hell] [7-10 T]  |
+----------------------+
```

The watering chip shows the range for the current season. Toxicity and difficulty appear as badges.

### `/plants/[id]` detail

- All properties of the plant.
- For the superuser, the same page switches into edit mode. Every field can be edited by hand, and the photo can be replaced.
- Delete is a hard delete after a confirmation and removes the photo too. There is no archive.

### `/import` (superuser only)

1. Take or pick a photo.
2. Choose "Mit KI ausfüllen" (with an optional typed species hint) or "Manuell".
3. Both open the same form, pre-filled or empty.
4. Nothing is stored or publicly visible until the superuser confirms.

If the AI call fails or sees no plant, the form opens empty with an error message.

### `/login`

Password form for the superuser.

## Technical decisions

| Area       | Decision                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Language   | German only, UI strings hardcoded, no i18n library. The AI is prompted to answer in German.               |
| AI         | `@tanstack/ai` with `@tanstack/ai-openrouter`. `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` in server env. |
| AI scope   | Import only. No re-fill on existing plants, no per-field suggestions.                                     |
| Auth       | Plain password in server env, signed HttpOnly session cookie, rate-limited login. No user table.          |
| Guarding   | Every write (import, edit, delete, photo upload) checks the session on the server.                        |
| Database   | SQLite through Drizzle with `better-sqlite3`.                                                             |
| Validation | Zod. One plant schema shared by the edit form (remote functions) and the AI `outputSchema`.               |
| Photos     | One per plant, stored on local disk, resized to WebP, EXIF location data stripped (the site is public).   |
| Hosting    | `adapter-node` in Docker with a compose file. SQLite file and photos live in one mounted data directory.  |
| Tests      | None. `pnpm run check` is the feedback loop.                                                              |

## Open risk

Sending a photo together with `outputSchema` through the OpenRouter text adapter is not confirmed by the TanStack AI docs. The docs confirm `outputSchema` on `chat()` and expose `adapter.inputModalities`, but show no image content part for `openRouterText`. Prove this with a small spike before the schema and forms depend on it. The model set in `OPENROUTER_MODEL` must accept image input and support structured output.

## Suggested build order

Not yet agreed; proposed as three phases.

1. **Data model and public pages**: `adapter-node`, Drizzle schema, Zod plant schema, grid with search, detail page.
2. **Auth and editing**: login, session cookie, server guard, edit mode, photo upload and processing, delete, manual import.
3. **AI import**: spike on photo plus `outputSchema`, then "Mit KI ausfüllen" in the import form, then Docker packaging.

## Explicitly out of scope

- Watering log, due status, notifications
- Viewer accounts, roles, invitations
- Species table shared between plants
- Managed room list, location filter, filter chips
- Photo gallery
- Climate group (humidity, temperature range) and troubleshooting list
- Multi-language content
- Model switching in the UI
