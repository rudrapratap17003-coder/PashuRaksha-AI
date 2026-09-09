# PASHURAKSHA AI (पशुरक्षा AI) 🐄🩺
### Explainable Livestock Health Intelligence, Early-Warning & Spatial Epidemiological Surveillance System

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-brightgreen.svg?style=for-the-badge&logo=googlecloud)](https://sih.gov.in/)
[![Problem Statement ID](https://img.shields.io/badge/PS_ID-SIH26128-blue.svg?style=for-the-badge)](https://sih.gov.in/)
[![Live App](https://img.shields.io/badge/Live_Site-pashu--raksha--ai.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://pashu-raksha-ai.vercel.app)
[![Jury Stage](https://img.shields.io/badge/Jury_Demo-Interactive_Stage-sky?style=for-the-badge&logo=react)](https://pashu-raksha-ai.vercel.app/presentation)
[![Backend Status](https://img.shields.io/badge/API_Engine-FastAPI_0.110-009688?style=for-the-badge&logo=fastapi)](https://pashu-raksha-ai.vercel.app/api/v1/health)

> 🌐 **Live Production Website**: [**https://pashu-raksha-ai.vercel.app**](https://pashu-raksha-ai.vercel.app)  
> ⚡ **SIH 2026 Interactive Jury Presentation**: [**https://pashu-raksha-ai.vercel.app/presentation**](https://pashu-raksha-ai.vercel.app/presentation)  
> 🏷️ **SIH Problem Statement**: **SIH26128** — *Efficient systems for early detection, prevention and management of livestock diseases and animal health issues.*  
> 🏛️ **Target Government Stakeholder**: **Maharashtra State Innovation Society (MSInS)** & **Department of Animal Husbandry, Government of Maharashtra**.

---

## 🎯 1. Core Mission & Value Proposition

In rural India, livestock epidemics like Foot-and-Mouth Disease (FMD) and Lumpy Skin Disease (LSD) often spread silently because days elapse between the moment a grassroots farmer notices symptoms and when district veterinary officers receive confirmation.

**PashuRaksha AI** bridges this critical gap through a closed-loop intelligence grid:

$$\text{Farmer Symptom} \longrightarrow \text{Explainable Risk} \longrightarrow \text{Field Triage} \longrightarrow \text{Lab RT-PCR} \longrightarrow \text{14-Day Cluster Radar} \longrightarrow \text{Containment Action}$$

> *"Detect earlier. Verify faster. See outbreaks sooner. Respond before they spread."*

---

## 🔄 2. The 8-Step Operational Surveillance Pipeline

```mermaid
graph LR
    A[1. Farmer Intake] -->|Symptom Report / Voice| B[2. Explainable Risk Engine]
    B -->|Score >= 80 HIGH| C[3. Field Worker Verification]
    C -->|Bio-Sample Swab| D[4. Veterinarian Triage]
    D -->|Lab Requisition| E[5. Diagnostic Lab RT-PCR]
    E -->|Positive Assay| F[6. 14-Day Temporal Cluster Engine]
    F -->|Spatial Centroid| G[7. Authority GIS Radar]
    G -->|Ring Vaccination & Biosecurity| H[8. Rapid Response & Closure]
```

1. **Farmer Intake**: Mobile-first report with bilingual voice extraction (Marathi/Hindi/English) and offline-first queue.
2. **Explainable Risk Assessment**: Transparent additive scoring (0–100) detailing exact risk factors (fever, vesicles, salivation, milk drop, herd spread).
3. **Field Verification**: Assigned Pashu Sakhi visits the farm, conducts clinical verification, and captures photo observations.
4. **Biological Sample Collection**: Field worker collects mucosal/vesicular swab under cold chain.
5. **Veterinary Clinical Triage**: Block polyclinic veterinarian reviews case timeline, prescribes supportive care, and requisitions diagnostic assays.
6. **Diagnostic Laboratory**: Regional Disease Diagnostic Laboratory runs RT-PCR/ELISA typing and validates test results.
7. **14-Day Outbreak Clustering**: Spatial-temporal engine calculates Haversine proximity across recent cases, detecting active outbreak clusters.
8. **District Authority Containment**: Authority dispatches Rapid Response Teams with ring vaccination doses and broadcasts biosecurity alerts.

---

## 🏛️ 3. The 6-Portal Ecosystem & 1-Click Demo Credentials

The platform features tailored experiences across 6 operational personas:

| Role | Demo Account | Default Password | Primary Jurisdiction | Dedicated Route |
| :--- | :--- | :--- | :--- | :--- |
| **🧑‍🌾 Farmer** | `farmer1@pashuraksha.ai` | `password123` | Baramati, Dist. Pune | [`/farmer`](https://pashu-raksha-ai.vercel.app/farmer) |
| **👩‍⚕️ Field Worker (Pashu Sakhi)** | `fieldworker1@pashuraksha.ai` | `password123` | Baramati Block Cluster | [`/field-worker`](https://pashu-raksha-ai.vercel.app/field-worker) |
| **🩺 Veterinarian** | `vet1@pashuraksha.ai` | `password123` | Taluka Polyclinic, Baramati | [`/vet`](https://pashu-raksha-ai.vercel.app/vet) |
| **🔬 Diagnostic Lab Technician** | `lab1@pashuraksha.ai` | `password123` | Regional Diagnostic Lab, Pune | [`/lab/dashboard`](https://pashu-raksha-ai.vercel.app/lab/dashboard) |
| **🏛️ District Health Authority** | `officer1@pashuraksha.ai` | `password123` | Pune District Animal Husbandry HQ | [`/authority`](https://pashu-raksha-ai.vercel.app/authority) |
| **⚙️ State Administrator** | `admin@pashuraksha.ai` | `password123` | MSInS HQ, Mumbai | [`/admin`](https://pashu-raksha-ai.vercel.app/admin) |

---

## 🔍 4. Technical Honesty & Classification Matrix

In accordance with strict technical evaluation standards, every feature is transparently classified:

| Feature Area | Classification | Technical Mechanism |
| :--- | :--- | :--- |
| **Authentication & RBAC** | `REAL` | Real bcrypt password hashing (`$2b$12`), JWT Bearer tokens, strict 401/403 authorization guards. |
| **Database & Persistence** | `REAL` | SQLAlchemy ORM supporting PostgreSQL in production and SQLite in development. |
| **Explainable Risk Engine** | `RULE-BASED` | Additive clinical syndromic weights with transparent point breakdown. |
| **Disease Differential Engine** | `RULE-BASED` | Syndromic pattern matching across FMD, Hemorrhagic Septicemia, Blackleg, and LSD. |
| **Case State Machine** | `REAL` | 10-state validated lifecycle (`REPORTED` $\rightarrow$ `CLOSED`) with immutable timeline audit logs. |
| **14-Day Temporal Clustering** | `RULE-BASED` | Spatial Haversine distance clustering strictly bounded by a rolling 14-day temporal window. |
| **GIS Outbreak Radar & Maps** | `REAL` | Interactive Leaflet GIS maps rendering exact village coordinates, centroid markers, and 1km/3km/5km containment zones. |
| **Voice Intake Assistant** | `REAL` / `SIMULATED` | Live Web Speech API with multilingual parser; clearly labeled simulation fallback when browser API is unsupported. |
| **Offline IndexedDB Storage** | `REAL` | Persistent IndexedDB queue (`PashuRakshaOfflineDB`) capturing reports offline and auto-syncing upon reconnection. |
| **Visual Lesion Assistant** | `SIMULATED` | Reference specimen atlas with canvas image quality assessment; explicitly labeled prototype screening without fake AI claims. |
| **Veterinary Decision Support** | `RULE-BASED` | Weight-adjusted medication dosage calculations with mandatory medical disclaimers. All fake cryptographic hashes removed. |
| **Maharashtra Livestock Data** | `SYNTHETIC DATA` | Synthetic demonstration dataset covering Pune, Nashik, Ahmednagar, Satara, Solapur, and Kolhapur districts. |

---

## ⏱️ 5. SIH 2026 7-Minute Deterministic Demo Scenario

The application includes a built-in deterministic demo controller with **1-Click Reset**:

* **0:00 — Problem Statement**: Livestock epidemics spread unnoticed in rural Maharashtra due to fragmented reporting.
* **0:30 — Farmer Report**: Farmer Ramesh Patil in Baramati reports `COW-101` with fever, oral lesions, and salivation.
* **1:15 — Explainable Risk**: Engine flags **Risk 82/100 (CRITICAL)** with exact contributing factor breakdown.
* **2:00 — Field Worker Outreach**: Pashu Sakhi receives prioritized visit, visits farm, and verifies symptoms.
* **2:30 — Bio-Sample Collection**: Oral swab sample is collected under cold chain (`SAMPLE_COLLECTED`).
* **3:00 — Veterinary Triage**: Taluka Vet examines case timeline, logs clinical notes, and escalates to Pune Lab.
* **3:30 — Diagnostic Lab**: Lab runs RT-PCR assay and validates **POSITIVE** result for FMD (Type O).
* **4:30 — 14-Day Cluster Engine**: Additional reports in Malegaon/Songaon trigger spatial-temporal clustering.
* **5:00 — GIS Outbreak Radar**: Authority dashboard visualizes active Baramati outbreak with 1km/3km/5km containment rings.
* **5:30 — District Response**: Authority mobilizes Rapid Response Team with 250 Ring Vaccines and broadcasts biosecurity advisory.
* **6:30 — Clean Reset**: 1-click database reset ready for immediate replay.

---

## 💻 6. Tech Stack & Architecture

```
                                  Vercel Edge Network
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
            React 18 + Vite (SPA)                      FastAPI REST API
       ├── Tailwind CSS + Lucide Icons           ├── SQLAlchemy ORM (10 Models)
       ├── Leaflet GIS Mapping                   ├── Explainable Risk Engine
       ├── IndexedDB Offline Sync                ├── 14-Day Outbreak Clustering
       └── Web Speech API Multilingual           └── JWT RBAC Security Layer
                                                       │
                                                       ▼
                                             PostgreSQL / SQLite
                                             (Persistent Database)
```

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React, Leaflet, Axios.
- **Backend**: FastAPI 0.110, Python 3.11+, SQLAlchemy 2.0, Pydantic v2, PyJWT, Passlib (Bcrypt).
- **Testing**: Pytest (19 comprehensive automated test suites covering QA, RBAC, state machine, and GIS).
- **Deployment**: Vercel (Frontend & SPA Rewrites) + Render / Vercel Serverless (FastAPI) + PostgreSQL.

---

## 🛠️ 7. Quickstart & Local Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Clone Repository
```bash
git clone https://github.com/rudrapratap17003-coder/PashuRaksha-AI.git
cd PashuRaksha-AI
```

### Step 2: Setup Backend
```bash
cd backend
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- **Interactive Jury Stage**: `http://localhost:5173/presentation`
- **FastAPI OpenAPI Swagger**: `http://localhost:8000/docs`

---

## 🧪 8. Automated Verification & Quality Assurance

### Run Backend Tests (19 / 19 Tests Passing)
```bash
pytest backend/tests/test_api.py -p no:warnings
```

### Run Frontend Production Build
```bash
cd frontend
npm run build
```

---

## ⚖️ 9. Statutory Medical Safety Disclaimer

> **Mandatory Non-Diagnostic Disclaimer**:  
> *PashuRaksha AI provides explainable risk assessment, visual screening support, and epidemiological early-warning surveillance for decision support. Final clinical diagnosis, prescription issuance, and treatment plans must always be conducted by a registered and licensed veterinarian under the Maharashtra State Veterinary Council (MSVC).*

---

## 🏆 Smart India Hackathon 2026 Deliverable
*Developed for Problem Statement **SIH26128** under Maharashtra State Innovation Society (MSInS), Government of Maharashtra.*
