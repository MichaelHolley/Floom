# Floom

A public, German-language care guide for the plants I own. Anyone can read it; one admin password guards importing, editing and deleting.

SvelteKit with runes and remote functions, SQLite through Drizzle, Tailwind.

## Developing

```sh
cp .env.example .env   # set ADMIN_PASSWORD
pnpm install
pnpm run dev
```

Validate changes with `pnpm run check` and `pnpm run lint`.

## Deploying with Docker and Portainer

The image is built from this repository by [compose.yaml](compose.yaml). The SQLite file and the photos live in the `data` volume, mounted at `/data`.

In Portainer: **Stacks → Add stack → Repository**, point it at this repository with `compose.yaml` as the compose path, and set the environment variables below.

| Variable             | Required | Purpose                                                |
| -------------------- | -------- | ------------------------------------------------------ |
| `ADMIN_PASSWORD`     | yes      | Superuser password. Changing it ends every session.    |
| `PORT`               | no       | Host port, defaults to `3000`.                         |
| `OPENROUTER_API_KEY` | no       | Only needed for "Mit KI ausfüllen".                    |
| `OPENROUTER_MODEL`   | no       | Must accept image input and support structured output. |

The app expects an HTTPS reverse proxy in front that forwards the `Host` and `X-Forwarded-For` headers. Without one, logging in does not work.

Without Portainer:

```sh
ADMIN_PASSWORD=... docker compose up -d --build
```
