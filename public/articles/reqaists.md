# Reqaists

Local REST API tester. It reads OpenAPI, asks a model running in Ollama to invent cases, then either calls the live API or only saves the JSON.

Nothing leaves the machine: default Ollama host is `http://127.0.0.1:11434`, default model `gemma4:e4b`. Override with `OLLAMA_MODEL` and `OLLAMA_HOST`.

Repo: [reqaists](https://github.com/ashen-v2/reqaists).

## Flow

1. Point at a live server, an OpenAPI URL, or a local OpenAPI JSON file.
2. Pick one operation.
3. Say how many cases (1–30) and what kind of data you want.
4. The tester builds a Pydantic batch model from that operation’s path, query, and body schemas.
5. Ollama fills the JSON against that schema (`format=schema`). Invalid JSON is retried once with the validation error.
6. Each case is tagged `happy`, `edge`, or `invalid`. Happy and edge must use the success status; invalid uses a 4xx.

Two modes:

| Mode | Input | What it does |
| --- | --- | --- |
| Run tests | Live address such as `localhost:8000` | Calls the endpoint and records pass/fail |
| Generate only | Server, OpenAPI URL, or file path | Writes cases, does not call the API |

Saved templates land in `runs/{timestamp}.json`.

## How a run is scored

httpx sends each case. Path values go in the URL, query values in params, JSON in the body. Actual status must match `expected_status`.

Happy and edge cases on GET, PUT, PATCH, or DELETE that take an id are seeded first: the tester finds the parent POST, creates a record, and injects the returned id. That keeps “get this customer” from failing because the id was never in the database.

## Interfaces

```text
python -m tester          # terminal
uvicorn tester.web:app --port 8080
```

The web UI is a second FastAPI app so a sample API can stay on port 8000.

## Sample API

`sample_api` is a Customer CRUD service on SQLite (`sample_api/customers.db`) with `/openapi.json`:

- `POST /customers`
- `GET /customers` (`city`, `min_age`)
- `GET /customers/{customer_id}`
- `PUT /customers/{customer_id}`
- `DELETE /customers/{customer_id}`

```text
uvicorn sample_api.main:app --port 8000
```

Docs: `http://localhost:8000/docs`.

## Layout

| Module | Role |
| --- | --- |
| `tester/openapi_loader.py` | Load and pick operations |
| `tester/schema_builder.py` | Pydantic model for one endpoint |
| `tester/generator.py` | Ollama batches of five, schema-validated |
| `tester/runner.py` | httpx calls, id seeding, pass/fail |
| `tester/cli.py` | Terminal |
| `tester/web.py` | Browser UI |

## Stack

| Piece | Role |
| --- | --- |
| Python 3.11+ | Runtime |
| FastAPI + Uvicorn | Sample API and web UI |
| Pydantic | Case schema |
| Ollama | Local model |
| OpenAPI | Endpoint list and types |
| httpx | HTTP client |
| SQLModel | Sample API storage |
