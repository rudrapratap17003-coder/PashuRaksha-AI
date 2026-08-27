# PASHURAKSHA AI — System Architecture & Design

## 1. System Topology
The platform follows a clean decoupled client-server architecture:

```
[ React 18 + Vite (Tailwind CSS) ]
               │
          REST (Axios / Fetch)
               ▼
[ FastAPI Application Gateway (Uvicorn) ]
       │                │
       ▼                ▼
[ Service Layer ] ──▶ [ AI / ML Engine ]
       │                (Risk Engine & Spatial-Temporal Clustering)
       ▼
[ PostgreSQL / Supabase Database ]
```

## 2. Differentiating Flow
```
Farmer Symptom Report
    │
    ▼
Individual AI Risk Score (0-100) + Explainable Factors
    │
    ▼
Spatial-Temporal Correlation Engine
    │
    ▼
Community Outbreak Cluster Detection
    │
    ├──▶ Veterinarian Priority Dispatch
    └──▶ District/Village Surveillance Heatmap
```
