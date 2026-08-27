# PASHURAKSHA AI — Database Schema Design

## Target DBMS
PostgreSQL 15+ (Supabase / Local)

## Relational Data Model

1. **`users`**
   - `id`: UUID (PK)
   - `name`: VARCHAR(255)
   - `phone`: VARCHAR(20)
   - `email`: VARCHAR(255) (UNIQUE)
   - `password_hash`: VARCHAR(255)
   - `role`: ENUM ('farmer', 'veterinarian', 'authority', 'admin')
   - `village`: VARCHAR(255)
   - `district`: VARCHAR(255)
   - `state`: VARCHAR(255)
   - `latitude`: FLOAT
   - `longitude`: FLOAT
   - `created_at`: TIMESTAMPTZ

2. **`animals`**
   - `id`: UUID (PK)
   - `animal_id`: VARCHAR(50) (UNIQUE)
   - `owner_id`: UUID (FK -> users.id)
   - `species`: VARCHAR(50)
   - `breed`: VARCHAR(100)
   - `age`: FLOAT (in years)
   - `gender`: ENUM ('male', 'female')
   - `weight`: FLOAT (in kg)
   - `vaccination_status`: VARCHAR(50)
   - `previous_diseases`: TEXT
   - `milk_production`: FLOAT (L/day)
   - `created_at`: TIMESTAMPTZ

3. **`vaccinations`**
   - `id`: UUID (PK)
   - `animal_id`: UUID (FK -> animals.id)
   - `vaccine_name`: VARCHAR(100)
   - `vaccination_date`: DATE
   - `next_due_date`: DATE
   - `status`: ENUM ('completed', 'due', 'overdue')
   - `notes`: TEXT

4. **`health_reports`**
   - `id`: UUID (PK)
   - `animal_id`: UUID (FK -> animals.id)
   - `reported_by`: UUID (FK -> users.id)
   - `fever`: BOOLEAN
   - `cough`: BOOLEAN
   - `nasal_discharge`: BOOLEAN
   - `reduced_appetite`: BOOLEAN
   - `diarrhea`: BOOLEAN
   - `lethargy`: BOOLEAN
   - `reduced_milk`: BOOLEAN
   - `difficulty_breathing`: BOOLEAN
   - `salivation`: BOOLEAN
   - `lesions`: BOOLEAN
   - `swelling`: BOOLEAN
   - `other_symptoms`: TEXT
   - `severity`: ENUM ('mild', 'moderate', 'severe')
   - `duration`: INT (days)
   - `number_of_animals_affected`: INT
   - `latitude`: FLOAT
   - `longitude`: FLOAT
   - `reported_at`: TIMESTAMPTZ

5. **`risk_assessments`**
   - `id`: UUID (PK)
   - `report_id`: UUID (FK -> health_reports.id)
   - `risk_score`: FLOAT (0-100)
   - `risk_level`: ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')
   - `possible_disease`: VARCHAR(255)
   - `disease_risk_score`: FLOAT
   - `risk_factors`: JSONB (Explainable breakdown)
   - `recommendation`: TEXT
   - `created_at`: TIMESTAMPTZ

6. **`outbreak_clusters`**
   - `id`: UUID (PK)
   - `cluster_name`: VARCHAR(255)
   - `disease_concern`: VARCHAR(255)
   - `latitude`: FLOAT
   - `longitude`: FLOAT
   - `radius`: FLOAT (in km)
   - `case_count`: INT
   - `affected_animals`: INT
   - `cluster_score`: FLOAT
   - `risk_level`: ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')
   - `detected_at`: TIMESTAMPTZ
   - `status`: ENUM ('active', 'investigating', 'contained', 'resolved')

7. **`veterinary_actions`**
   - `id`: UUID (PK)
   - `case_id`: UUID (FK -> health_reports.id)
   - `veterinarian_id`: UUID (FK -> users.id)
   - `action`: VARCHAR(255)
   - `notes`: TEXT
   - `lab_referral`: BOOLEAN
   - `status`: ENUM ('pending', 'investigated', 'closed')
   - `created_at`: TIMESTAMPTZ

8. **`alerts`**
   - `id`: UUID (PK)
   - `user_id`: UUID (FK -> users.id)
   - `alert_type`: VARCHAR(50)
   - `title`: VARCHAR(255)
   - `message`: TEXT
   - `risk_level`: ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')
   - `related_cluster_id`: UUID (FK -> outbreak_clusters.id, nullable)
   - `is_read`: BOOLEAN
   - `created_at`: TIMESTAMPTZ
