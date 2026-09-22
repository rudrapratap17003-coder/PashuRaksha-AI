# 🐄 PASHURAKSHA AI

## Livestock Health Intelligence, Early-Warning & Outbreak Response Platform

<p align="center">
  <img src="https://img.shields.io/badge/Smart%20India%20Hackathon-2026-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/SIH26128-Problem%20Statement-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI%20%2B%20ML-Livestock%20Health-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge" />
</p>

<p align="center">
  <strong>Detect Earlier • Assess Smarter • Map Outbreaks • Respond Faster</strong>
</p>

---

## 🌐 Live Demo

### 🚀 PASHURAKSHA AI
https://pashu-raksha-ai.vercel.app/

### 💻 Source Code
https://github.com/rudrapratap17003-coder/PashuRaksha-AI

### 🎯 Smart India Hackathon
**Problem Statement:** SIH26128  
**Theme:** Agriculture, FoodTech & Rural Development

---

# 🧭 Overview

**PASHURAKSHA AI** is an AI-assisted livestock health intelligence and outbreak early-warning platform designed to connect the livestock-health response chain — from the first symptom reported by a farmer to AI-assisted risk assessment, veterinary triage, geographic outbreak intelligence and coordinated response.

The platform transforms isolated field observations into actionable intelligence:

```text
FIELD SIGNAL
     ↓
AI / ML ANALYSIS
     ↓
RISK ASSESSMENT
     ↓
ANIMAL INTELLIGENCE
     ↓
OUTBREAK INTELLIGENCE
     ↓
VETERINARY TRIAGE
     ↓
FIELD RESPONSE
     ↓
REGIONAL ADVISORY
```

> **A livestock-health system should not only record what happened. It should help identify what may be happening, where it is happening, how serious the signal may be, and what needs attention next.**

---

# 🎯 The Problem

Livestock disease detection and response can involve multiple disconnected stages:

```text
Farmer notices symptoms
        ↓
Manual / delayed reporting
        ↓
Field verification
        ↓
Veterinary assessment
        ↓
Laboratory confirmation
        ↓
Disease cluster becomes visible
        ↓
Authorities coordinate response
```

The challenge is not simply collecting data.

The challenge is connecting:

> **DATA → INTELLIGENCE → ACTION**

PASHURAKSHA AI provides a digital intelligence layer connecting field reports, livestock records, AI/ML analysis, veterinary workflows and geographic surveillance.

---

# 💡 The PASHURAKSHA Approach

```text
                    ┌──────────────────────┐
                    │   FIELD OBSERVATION  │
                    │ Symptoms / Voice /   │
                    │ Health Information   │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │     AI / ML LAYER    │
                    │ Risk + Disease       │
                    │ Intelligence         │
                    └──────────┬───────────┘
                               ↓
                         ┌─────┴─────┐
                         ↓           ↓
                  🐄 ANIMAL       🚨 OUTBREAK
                    PROFILE          SIGNAL
                         │           │
                         └─────┬─────┘
                               ↓
                    🗺️ GEOGRAPHIC
                    INTELLIGENCE
                               ↓
                    🩺 VETERINARY
                       TRIAGE
                               ↓
                     FIELD RESPONSE
                               ↓
                   📢 REGIONAL ADVISORY
```

---

# 🧠 AI / ML Architecture

PASHURAKSHA AI uses a **hybrid intelligence architecture** consisting of three major intelligence components:

```text
                  PASHURAKSHA INTELLIGENCE
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
   MACHINE LEARNING   DISEASE ENGINE   EXPLAINABLE RISK
       MODEL              │                ENGINE
          │               │                  │
          ↓               ↓                  ↓
   Health-Risk       Symptom-Based      Clinical Risk
   Prediction        Matching           Assessment
          │               │                  │
          └───────────────┴──────────────────┘
                          ↓
                   VETERINARY TRIAGE
```

---

# 🌲 1. Trained Machine Learning Model

## Random Forest Health-Risk Prediction

PASHURAKSHA AI includes a **trained Random Forest Classifier** for livestock clinical health-risk prediction.

The model was trained using a clinical livestock dataset and predicts whether a clinical episode represents a health-risk condition.

## Dataset

| Property | Value |
|---|---:|
| Clinical Episodes | **5,619** |
| Unique Animals | **548** |
| Features | **21** |
| Target | **Health Risk: Yes / No** |
| Negative Class | **5,054** |
| Positive Class | **565** |

## 🧪 ML Training Pipeline

```text
Clinical Dataset
       ↓
Data Cleaning
       ↓
Missing Value Handling
       ↓
Numerical Median Imputation
       ↓
Categorical Imputation
       ↓
One-Hot Encoding
       ↓
Feature Matrix
       ↓
Random Forest Classifier
       ↓
Health-Risk Prediction
```

## ⚙️ Model Configuration

```text
Model:
Random Forest Classifier

Number of Trees:
400

Class Weight:
Balanced

Validation:
Animal-level GroupShuffleSplit

Train/Test:
80 / 20
```

### Why Animal-Level Splitting?

Multiple clinical records can belong to the same animal.

If records from the same animal appeared in both training and testing sets, the model evaluation could become overly optimistic because information from the same animal could leak between the two datasets.

Therefore, the dataset was split using **animal identity as the grouping variable**.

This creates a more meaningful evaluation of how the model performs on previously unseen animals.

---

# 📊 Model Performance

Evaluation on the held-out test set:

| Metric | Result |
|---|---:|
| **Accuracy** | **91.36%** |
| **Precision** | **55.81%** |
| **Recall** | **83.48%** |
| **F1 Score** | **66.90%** |
| **ROC-AUC** | **94.22%** |

### Confusion Matrix

```text
                  Predicted
                 No       Yes

Actual No       908       76

Actual Yes       19       96
```

The model demonstrates strong recall on the available test set, which is relevant to an early-warning use case where missing a potentially high-risk episode can be important.

> These results are based on the available dataset and held-out test split. They do not represent clinical validation or real-world epidemiological performance.

---

# 🔬 Feature Importance

The Random Forest model identified several features with notable predictive contribution:

| Feature | Importance |
|---|---:|
| Rectal Temperature | **0.210** |
| Weight | **0.099** |
| Girth | **0.057** |
| Faecal Consistency | **0.054** |
| Grazing | **0.025** |

This provides an additional interpretability layer around the model's predictions.

---

# 🦠 2. Disease Intelligence Engine

The platform also contains a symptom-based disease differential engine.

The current prototype uses **TF-IDF vectorization and cosine similarity** to compare reported symptoms against disease symptom representations.

```text
Symptom Input
      ↓
TF-IDF Vectorization
      ↓
Symptom Representation
      ↓
Cosine Similarity
      ↓
Disease Matching
      ↓
Top-N Disease Predictions
```

For example, a report containing:

```text
coughing
nasal discharge
difficulty breathing
fever
```

may produce a differential such as:

```text
1. Bovine Respiratory Disease
2. Pneumonia
3. Parainfluenza-3 Virus
```

This is a **disease differential signal**, not a confirmed veterinary diagnosis.

---

# 🧠 3. Explainable Clinical Risk Engine

The platform combines disease-level information with clinical observations to generate an explainable prototype risk assessment.

Current factors include:

- 🌡️ Temperature
- 🍽️ Appetite
- 🐄 Activity level
- 🦠 Intrinsic disease threat

Example:

```text
┌─────────────────────────────────────┐
│          AI RISK ASSESSMENT         │
│                                     │
│              85 / 100               │
│               HIGH                  │
├─────────────────────────────────────┤
│ Intrinsic Threat        +40         │
│ Critical Temperature    +25         │
│ Poor Appetite           +20         │
├─────────────────────────────────────┤
│ Primary Risk Signal:                │
│ Critical fever combined with        │
│ loss of appetite.                   │
├─────────────────────────────────────┤
│ Recommended Action:                 │
│ Urgent veterinary attention.        │
└─────────────────────────────────────┘
```

> **The system should explain why a case was flagged — not just display a number.**

The risk engine is currently a **prototype decision-support layer** and is not clinically validated.

---

# 🗺️ Geographic Outbreak Intelligence

A single sick animal may represent an isolated case.

Multiple similar cases appearing in the same geographic region can become an early outbreak signal.

PASHURAKSHA AI connects:

```text
Animal
   ↓
Health Report
   ↓
Disease Signal
   ↓
Location
   ↓
Time
   ↓
Cluster
   ↓
Outbreak Intelligence
```

The system can organize disease signals using:

- State
- District
- Taluka
- Village
- Disease
- Case count
- Alert level
- Temporal information

Example:

```text
Maharashtra
└── Dhule
    └── Shirpur
        └── Bovine Respiratory Disease
             ├── Case 1
             ├── Case 2
             ├── Case 3
             └── ...
```

This transforms individual health reports into **population-level surveillance intelligence**.

---

# 🚨 Veterinary Triage

High-risk health reports can enter the veterinary workflow.

```text
Health Report
      ↓
AI / ML Assessment
      ↓
Risk Classification
      ↓
HIGH RISK
      ↓
Veterinary Case
      ↓
Priority Assignment
      ↓
Veterinarian
      ↓
Field Response
```

The objective is to help veterinary teams answer:

> **Which case needs attention first?**

---

# 🐄 Digital Livestock Profile

Each animal can maintain a digital health identity containing:

- Tag number
- Species
- Breed
- Sex
- Date of birth
- Vaccination status
- Farmer
- Location
- Health reports
- Risk history
- Veterinary cases

```text
                    🐄 ANIMAL
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
   Identity        Health Data      Location
                       │
                 ┌─────┼─────┐
                 ↓     ↓     ↓
              Symptoms Risk Reports
                       │
                       ↓
                Risk Intelligence
```

---

# 🧑‍🌾 Farmer Intelligence

Farmers are connected to their livestock and health events.

```text
Farmer
  │
  ├── Animal 01
  │     ├── Health Reports
  │     └── Risk History
  │
  ├── Animal 02
  │     └── Health Reports
  │
  └── Location
        └── Regional Disease Signals
```

This provides the foundation for a longitudinal livestock-health record.

---

# 🎙️ Multilingual & Voice-Assisted Reporting

Rural users may not always be comfortable with text-heavy interfaces.

The platform includes a voice-oriented reporting workflow:

```text
Voice Input
     ↓
Speech Recognition
     ↓
Symptom Capture
     ↓
Health Assessment
     ↓
Risk Intelligence
```

The architecture is designed to support multilingual field interaction while maintaining structured health records.

Where browser or service limitations exist, clearly identified fallback/demo behavior is used.

---

# 📡 Offline-First Field Workflow

Connectivity may be unreliable in rural environments.

PASHURAKSHA AI includes an offline queue architecture using browser-side persistent storage.

```text
Field Worker
     ↓
Create Report
     ↓
Internet Available?
   ↙         ↘
 YES          NO
  ↓            ↓
Backend     IndexedDB
               │
               ↓
          Local Queue
               │
       Connection Restored
               ↓
              Sync
               ↓
           Backend
```

This allows field workflows to continue during temporary connectivity loss.

---

# 🔬 Diagnostic Workflow

AI-assisted early warning must remain separate from confirmed diagnosis.

The intended workflow is:

```text
Potential Case
      ↓
Field Assessment
      ↓
AI-Assisted Triage
      ↓
Veterinary Review
      ↓
Sample Collection
      ↓
Laboratory Testing
      ↓
Confirmed / Rejected
      ↓
Epidemiological Intelligence
```

This ensures that AI supports professional decision-making rather than replacing it.

---

# 🏛️ Multi-Stakeholder Ecosystem

PASHURAKSHA AI is designed around multiple operational roles.

| Stakeholder | Primary Responsibility |
|---|---|
| 🧑‍🌾 Farmer | Report symptoms & manage livestock |
| 👩‍⚕️ Pashu Sakhi / Field Worker | Field verification & reporting |
| 🩺 Veterinarian | Clinical assessment & case management |
| 🔬 Diagnostic Laboratory | Sample and test management |
| 🏛️ Authority | Regional surveillance & outbreak response |
| ⚙️ Administrator | Platform, users & access control |

The goal is to create one connected intelligence network instead of isolated applications.

---

# 🖥️ Platform Modules

### 🏠 Command Center
Central operational overview containing threat level, system health, livestock statistics, health intelligence, outbreak signals, recent activity and priority cases.

### 🚨 Outbreak Intelligence
Regional disease and outbreak monitoring.

### 🤖 AI Health Assessment
Clinical information → AI/ML assessment → risk interpretation.

### 🩺 Veterinary Triage
Priority cases and veterinary response workflow.

### 🐄 Livestock Registry
Digital livestock records and profiles.

### 📋 Health Reports
Historical health-report records.

### 🧪 Diagnostic Workflow
Sample and test-oriented clinical workflow.

### 🗺️ Geographic Intelligence
Location-based disease and outbreak visualization.

### 📢 Regional Advisory
Health advisories and regional response information.

### 🎮 Scenario Simulator
Scenario-based outbreak and response simulation.

### 🎙️ Multilingual Advisory
Language-aware information delivery.

### 🧑‍🌾 Farmer / Animal Profiles
Connected farmer and animal intelligence.

### 🎬 Demo Mode
Controlled demonstration environment for presentations and evaluation.

---

# 🔄 End-to-End Operational Pipeline

```text
┌─────────────────┐
│  FIELD REPORT   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ AI HEALTH       │
│ ASSESSMENT      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ RISK ENGINE     │
└────────┬────────┘
         ↓
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌──────────────┐
│ ANIMAL │ │ OUTBREAK     │
│PROFILE │ │ SIGNAL       │
└───┬────┘ └──────┬───────┘
    │             ↓
    │      GEOGRAPHIC
    │      INTELLIGENCE
    │             ↓
    └──────→ VETERINARY
             TRIAGE
                 ↓
          FIELD RESPONSE
                 ↓
       REGIONAL ADVISORY
                 ↓
        OUTBREAK MONITORING
```

---

# 🏗️ System Architecture

```text
                         PASHURAKSHA AI
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
       React + Vite                         FastAPI
        Frontend                            Backend
              │                                 │
      ┌───────┼────────┐                ┌───────┼────────┐
      ↓       ↓        ↓                ↓       ↓        ↓
     UI      GIS     Voice             API     ML       Auth
                       │                       │
                       │                       ↓
                       │                Intelligence
                       │                       │
                       └──────────┐            │
                                  ↓            │
                              PostgreSQL       │
                                  │            │
                                  └─────┬──────┘
                                        ↓
                              Outbreak Intelligence
```

---

# 🧰 Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide Icons
- GIS / Mapping
- IndexedDB
- Web Speech API

## Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- REST APIs
- JWT Authentication
- Role-Based Access Control

## Database

- PostgreSQL
- SQLite for supported development/test configurations

## Machine Learning

- Python
- scikit-learn
- Random Forest
- TF-IDF
- Cosine Similarity
- NumPy
- pandas
- joblib

## Deployment

- Vercel
- Render
- PostgreSQL

---

# 📁 Repository Structure

```text
PashuRaksha-AI/
│
├── api/
│
├── backend/
│   ├── app/
│   ├── tests/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── ...
│
├── ml/
│   ├── datasets/
│   ├── models/
│   ├── training/
│   └── prediction/
│
├── data/
│
├── docs/
│
├── render.yaml
├── vercel.json
├── package.json
├── .env.example
├── CONTRIBUTING.md
└── README.md
```

---

# 🔐 Data & Security

The project separates source code, configuration and secrets.

Sensitive values should never be committed to Git.

Examples include:

```text
.env
backend/.env
database passwords
API keys
JWT secrets
deployment credentials
```

These should be managed through environment variables and deployment configuration.

---

# 📊 Demonstration Data

The current demonstration environment contains synthetic/sample livestock-health data.

This data is intended for:

- Development
- Testing
- SIH demonstration
- Workflow simulation
- UI evaluation

It must not be interpreted as an official government epidemiological dataset.

---

# 🧪 Testing & Validation

## Machine Learning

The ML pipeline includes:

- Train/test separation
- Animal-level grouping
- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC
- Confusion Matrix
- Feature Importance

## Backend

- API health checks
- Endpoint validation
- Database persistence
- Workflow testing

## Frontend

- Production build validation
- API integration
- Component workflows
- Responsive interface testing

---

# 🔬 Technical Transparency

We intentionally distinguish implemented systems from experimental or prototype components.

| Component | Status |
|---|---|
| React Frontend | 🟢 Implemented |
| FastAPI Backend | 🟢 Implemented |
| PostgreSQL Persistence | 🟢 Implemented |
| Livestock Records | 🟢 Implemented |
| Health Reports | 🟢 Implemented |
| Veterinary Cases | 🟢 Implemented |
| Random Forest ML Model | 🟢 Trained |
| ML Evaluation Pipeline | 🟢 Implemented |
| TF-IDF Disease Matching | 🟢 Implemented |
| Explainable Risk Engine | 🟡 Prototype |
| Geographic Outbreak Intelligence | 🟢 / 🟡 Prototype |
| Voice Interaction | 🟢 / 🟡 Browser / Service Dependent |
| Offline Synchronization | 🟢 Implemented |
| Laboratory Workflow | 🟡 Prototype |
| Large-Scale Epidemiological Deployment | 🚧 Future |
| Clinically Validated AI | 🚧 Future |

> **We would rather clearly identify a prototype than falsely label an experimental component as clinically validated AI.**

---

# 🚀 Roadmap

## Phase 1 — Foundation

- [x] Digital livestock records
- [x] Farmer records
- [x] Health reports
- [x] Veterinary cases
- [x] PostgreSQL integration
- [x] REST APIs

## Phase 2 — Intelligence

- [x] Random Forest health-risk model
- [x] Model evaluation
- [x] Feature importance
- [x] Disease differential engine
- [x] Explainable risk engine

## Phase 3 — Surveillance

- [x] Geographic outbreak signals
- [x] Disease intelligence
- [x] Veterinary triage
- [x] Regional advisory
- [x] Incident / response workflow

## Phase 4 — Field Intelligence

- [x] Voice-oriented reporting
- [x] Multilingual workflows
- [x] Offline queue architecture
- [x] Scenario simulation

## Phase 5 — Future

- [ ] Larger clinically validated datasets
- [ ] Multi-disease supervised models
- [ ] Better temporal outbreak forecasting
- [ ] Computer-vision models trained on validated veterinary imagery
- [ ] Laboratory integration
- [ ] Real-world notification infrastructure
- [ ] Government-compatible integrations
- [ ] Large-scale field validation

---

# 🏆 Smart India Hackathon 2026

## Problem Statement

**SIH26128**

## Theme

**Agriculture, FoodTech & Rural Development**

## Project

**PASHURAKSHA AI — Livestock Health Intelligence & Outbreak Early-Warning Platform**

### Vision

Build an intelligent livestock-health network connecting:

```text
FIELD
  ↓
ANIMAL
  ↓
AI / ML
  ↓
VETERINARIAN
  ↓
LABORATORY
  ↓
GEOGRAPHIC SURVEILLANCE
  ↓
AUTHORITY
  ↓
RESPONSE
```

---

# 🎬 SIH Demonstration Scenario

A typical demonstration follows this sequence:

```text
01  Farmer reports symptoms
          ↓
02  Animal health information is captured
          ↓
03  ML model / disease intelligence evaluates signals
          ↓
04  Explainable risk assessment is generated
          ↓
05  High-risk case enters veterinary triage
          ↓
06  Similar cases are analyzed geographically
          ↓
07  Potential outbreak signal emerges
          ↓
08  Veterinary / field response is initiated
          ↓
09  Regional advisory is generated
          ↓
10  Situation continues to be monitored
```

---

# 🧠 Why PASHURAKSHA?

Traditional digital health records answer:

> **"What happened?"**

PASHURAKSHA AI aims to answer:

> **"What is happening, where is it happening, how serious might it be, and what should happen next?"**

The platform therefore moves from:

```text
RECORD KEEPING
      ↓
INTELLIGENCE
      ↓
EARLY WARNING
      ↓
COORDINATED RESPONSE
```

---

# 🌍 Long-Term Vision

Our long-term vision is to build a **digital nervous system for livestock health surveillance**.

A system where:

```text
Every Animal
      ↓
Every Health Signal
      ↓
Every Veterinary Case
      ↓
Every Diagnostic Result
      ↓
Every Geographic Cluster
      ↓
Every Response
```

can contribute to a continuously improving livestock-health intelligence network.

---

# 🛠️ Local Development

## Requirements

- Python 3.11+
- Node.js 18+
- npm
- PostgreSQL

## Clone Repository

```bash
git clone https://github.com/rudrapratap17003-coder/PashuRaksha-AI.git
cd PashuRaksha-AI
```

## Backend

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

Configure environment variables according to `.env.example`.

Start the API:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend health:

```text
http://127.0.0.1:8000/health
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Open:

```text
http://localhost:5173
```

Vite may automatically select another port if `5173` is occupied.

---

# 🤝 Contributing

Contributions and improvements are welcome.

Before submitting a pull request:

1. Create a feature branch.
2. Keep changes focused.
3. Test the affected workflow.
4. Update documentation where required.
5. Never commit secrets.
6. Submit a clear pull request description.

---

# ⚖️ Veterinary & Clinical Disclaimer

> **PASHURAKSHA AI is an AI-assisted livestock-health decision-support and early-warning prototype.**

The system does not provide a confirmed veterinary diagnosis.

AI-generated risk scores, disease matches, recommendations and outbreak signals should be reviewed by qualified professionals.

Clinical diagnosis, treatment, vaccination and disease-control decisions remain the responsibility of authorized veterinary and public-health professionals.

---

# 📜 Project Status

## 🚧 Active Development

PASHURAKSHA AI is an evolving Smart India Hackathon prototype.

The architecture has been designed to allow experimental intelligence components to progressively evolve toward:

- Larger and more diverse datasets
- Clinically validated labels
- Stronger supervised learning models
- Disease-specific prediction models
- Improved temporal outbreak forecasting
- Validated computer-vision models
- Real-world field trials
- Scalable deployment
- Interoperability with livestock-health infrastructure

---

# 👥 Team

Built by a student innovation team participating in:

## 🇮🇳 SMART INDIA HACKATHON 2026

The team contributes across:

- AI / ML
- Backend Engineering
- Frontend Engineering
- Database Architecture
- GIS
- Product Design
- Research
- Deployment
- Documentation

---

# 🐄 PASHURAKSHA AI

## Detect Earlier. Understand Faster. Respond Smarter.

### From a sick animal...

### to an early signal...

### to a verified case...

### to a mapped outbreak...

### to a coordinated response.

---

<p align="center">
<strong>🐄 Protect Livestock. Empower Veterinarians. Strengthen Early Warning.</strong>
</p>
