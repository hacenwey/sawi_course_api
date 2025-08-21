# Uber Backend (NestJS + Docker)

## Quick start

```powershell
# Clone & enter folder
# Copy env
copy .env.example .env

# Start Postgres & Redis (and API in watch mode via Dockerfile)
docker compose up --build
```

API: http://localhost:3000

### Local dev without Docker for API
```powershell
docker compose up -d db redis
copy .env.example .env
# Edit .env to set DB_HOST=localhost and REDIS_HOST=localhost for local run
npm i
npm run start:dev
```

## Endpoints

- `POST /users` { phone, password, role? }
- `POST /auth/login` { phone, password }
- `POST /rides` (Bearer) { origin:[lat,lng], dest:[lat,lng] }
- `PATCH /rides/:id/assign` (Bearer) { driverId? }
- `PATCH /rides/:id/status` (Bearer) { status }
- `GET /rides/:id` (Bearer)
- `GET /rides` (Bearer)

Realtime WS (Socket.IO):
- `driver:loc` { driverId, lat, lng, heading? }
- `ride:join` { rideId }
- `ride:loc` { rideId, lat, lng }
