
# CPRA Response Planner (MVP Skeleton)

Thin prototype to turn meeting notes into a CPRA scope sheet, compute deadlines,
draft acknowledgment/extension letters, and sync tasks (calendar/email).

## Quick start

### Backend (FastAPI)
```bash
cd backend/fastapi
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Backend (Express, optional)
```bash
cd backend/express
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend at http://localhost:5173 proxies `/api/*` to FastAPI at http://localhost:8000.
- Express backend listens on http://localhost:8080 (update `frontend/vite.config.ts` if you use it).

### Run all dev servers (one command)
From the repo root, you can run FastAPI, Express, and Vite together:

```bash
# prerequisites: Python deps installed
pip install -r backend/fastapi/requirements.txt

# then start all three (standard mode)
npm run dev

# more resilient mode (auto-restart, don’t kill others)
npm run dev:resilient
```

This launches:
- `FastAPI` at `http://localhost:8000`
- `Express` at `http://localhost:8080`
- `Vite` dev server at `http://localhost:5173` (proxies `/api/*` to FastAPI)

## Build

Use the root workspace scripts to build the frontend and compile the Express backend:

```bash
# from repo root
npm install               # installs deps in workspaces (frontend, backend/express)
npm run build             # builds frontend (Vite) and compiles Express (tsc)

# or individually
npm run build:frontend
npm run build:express

# run compiled Express
npm -w backend/express run start
```

## Running tests

### Backend (FastAPI)
```bash
cd backend/fastapi
pip install -r requirements.txt
PYTHONPATH=. pytest
```

### Backend (Express)
TypeScript tests use Node's built-in test runner with `ts-node`.
```bash
cd backend/express
node --loader ts-node/esm --test tests/*.test.ts
```
