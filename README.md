<p align="center">
  <img src="https://content.umami.is/website/images/umami-logo.png" alt="Umami Logo" width="100">
</p>

<h1 align="center">Umami</h1>

<p align="center"><i>A simple, fast, privacy-focused alternative to Google Analytics.</i></p>

<p align="center">
  <a href="https://github.com/umami-software/umami/releases"><img src="https://img.shields.io/github/release/umami-software/umami.svg" alt="GitHub Release"></a>
  <a href="https://github.com/umami-software/umami/blob/master/LICENSE"><img src="https://img.shields.io/github/license/umami-software/umami.svg" alt="MIT License"></a>
  <a href="https://github.com/umami-software/umami/actions"><img src="https://img.shields.io/github/actions/workflow/status/umami-software/umami/ci.yml" alt="Build Status"></a>
</p>

---

## Getting Started

See the [getting started guide](https://umami.is/docs/) for detailed documentation.

## Installing from Source

Requirements:

- Node.js 18.18 or newer (Node.js 20 LTS recommended)
- PostgreSQL 12.14 or newer

Clone the repository and install dependencies:

```bash
git clone https://github.com/umami-software/umami.git
cd umami
pnpm install
```

Create an `.env` file containing your database connection:

```bash
DATABASE_URL=postgresql://username:mypassword@localhost:5432/mydb
```

Build and start the application:

```bash
pnpm run build
pnpm run start
```

The application is available at `http://localhost:3000`. The first build creates the database tables and an `admin` user with password `umami`.

## Installing with Docker

Use the published image:

```bash
docker pull docker.umami.is/umami-software/umami:latest
```

Or start Umami with PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

## Getting Updates

For a source installation:

```bash
git pull
pnpm install
pnpm build
```

For Docker Compose:

```bash
docker compose pull
docker compose up --force-recreate -d
```
