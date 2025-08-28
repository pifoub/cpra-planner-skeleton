
# CPRA Response Planner (MVP Skeleton)

Thin prototype to turn meeting notes into a CPRA scope sheet, compute deadlines,
draft acknowledgment/extension letters, and sync tasks (calendar/email).

## Quick start (FastAPI + Frontend)

### 1) Backend (FastAPI)
```bash
cd backend/fastapi
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend at http://localhost:5173 proxies `/api/*` to FastAPI http://localhost:8000
- Optional **Express** starter provided if you prefer Node later.

## Running tests

### Backend (FastAPI)
```bash
cd backend/fastapi
pip install -r requirements.txt
pytest
```

### Backend (Express)
TypeScript tests use Node's built-in test runner with `ts-node`.
```bash
cd backend/express
node --loader ts-node/esm --test tests/*.test.ts
```
