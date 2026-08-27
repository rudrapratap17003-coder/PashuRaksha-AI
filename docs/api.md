# PASHURAKSHA AI — API Specification

## Base URL
`/api/v1`

## Planned Endpoints (Roadmap)

### Core & Health
- `GET /api/v1/health` — System status and service health

### Authentication
- `POST /api/v1/auth/register` — Register farmer / vet / authority
- `POST /api/v1/auth/login` — JWT authentication token
- `GET /api/v1/users/me` — Current authenticated user profile

### Animals
- `POST /api/v1/animals` — Register new livestock record
- `GET /api/v1/animals` — List owned or accessible animals
- `GET /api/v1/animals/{id}` — Get single animal profile

### Vaccinations
- `POST /api/v1/vaccinations` — Add vaccination log
- `GET /api/v1/vaccinations` — List vaccinations for animal

### Health Reports & AI Risk
- `POST /api/v1/health-reports` — Submit symptom report & trigger AI risk scoring
- `GET /api/v1/health-reports/{id}` — Get report details & explainable risk factors
- `GET /api/v1/risk-assessments/{id}` — Retrieve AI risk breakdown

### Clusters & Early Warning
- `GET /api/v1/clusters` — Active outbreak clusters & geospatial centroids
- `GET /api/v1/alerts` — Role-specific prioritized notifications

### Veterinarian & Authority Portals
- `GET /api/v1/vet/cases` — Triage queue ordered by risk
- `POST /api/v1/vet/cases/{id}/action` — Mark case investigated / lab referral
- `GET /api/v1/authority/dashboard` — Surveillance KPIs & village statistics
- `GET /api/v1/authority/map-data` — Heatmap point collection
