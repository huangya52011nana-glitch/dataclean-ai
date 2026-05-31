# DataClean AI

DataClean AI is a full-stack project for building AI-assisted data cleaning workflows.

## Overview

The repository is organized as a client/server application. The client provides the user interface, while the server can handle data processing, API routes, and future AI-assisted cleanup logic.

## Tech Stack

- Root workspace scripts with `concurrently`
- Client app in `client/`
- Server app in `server/`
- TypeScript

## Project Structure

```text
client/   Frontend application
server/   Backend service
docs/     Project notes and documentation
```

## Getting Started

Install root dependencies:

```bash
npm install
```

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd server
npm install
```

Run the client and server together from the repository root:

```bash
npm run dev
```

## Roadmap

- Add the first working data-cleaning workflow.
- Document supported upload formats.
- Add examples showing messy input and cleaned output.
- Add tests for common cleanup cases.
