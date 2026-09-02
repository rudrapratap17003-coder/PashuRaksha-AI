"""
Database seeder service — Maharashtra livestock surveillance demo data.
Populates tables with realistic synthetic demonstration data for SIH 2026.
IMPORTANT: All data is synthetic and clearly labeled as prototype demonstration data.
"""
from datetime import datetime, timedelta, date
import random
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.animal import Animal
from app.models.vaccination import Vaccination
from app.models.health_report import HealthReport
from app.models.risk_assessment import RiskAssessment
from app.models.cluster import OutbreakCluster
from app.models.alert import Alert
from app.models.lab_referral import LabReferral
from app.models.case_timeline import CaseTimelineEvent
from app.models.farm import Farm
from app.models.notification import Notification

# Maharashtra village geo data
VILLAGES = [
    {"name": "Baramati", "taluka": "Baramati", "district": "Pune", "lat": 18.1515, "lng": 74.5772},
    {"name": "Shirur", "taluka": "Shirur", "district": "Pune", "lat": 18.8264, "lng": 74.3789},
    {"name": "Indapur", "taluka": "Indapur", "district": "Pune", "lat": 18.1101, "lng": 75.0273},
    {"name": "Junnar", "taluka": "Junnar", "district": "Pune", "lat": 19.2094, "lng": 73.8765},
    {"name": "Maval", "taluka": "Maval", "district": "Pune", "lat": 18.7565, "lng": 73.5135},
    {"name": "Sinnar", "taluka": "Sinnar", "district": "Nashik", "lat": 19.8435, "lng": 73.9969},
    {"name": "Igatpuri", "taluka": "Igatpuri", "district": "Nashik", "lat": 19.6948, "lng": 73.5628},
    {"name": "Dindori", "taluka": "Dindori", "district": "Nashik", "lat": 20.2107, "lng": 73.8402},
    {"name": "Shrigonda", "taluka": "Shrigonda", "district": "Ahmednagar", "lat": 18.6155, "lng": 74.6978},
    {"name": "Parner", "taluka": "Parner", "district": "Ahmednagar", "lat": 19.0025, "lng": 74.4409},
    {"name": "Karad", "taluka": "Karad", "district": "Satara", "lat": 17.2862, "lng": 74.1838},
    {"name": "Wai", "taluka": "Wai", "district": "Satara", "lat": 17.9535, "lng": 73.8912},
    {"name": "Karvir", "taluka": "Karvir", "district": "Kolhapur", "lat": 16.6958, "lng": 74.2245},
    {"name": "Hatkanangale", "taluka": "Hatkanangale", "district": "Kolhapur", "lat": 16.7600, "lng": 74.4308},
    {"name": "Barshi", "taluka": "Barshi", "district": "Solapur", "lat": 18.2336, "lng": 75.6924},
]

FARMER_NAMES = [
    "Ramesh Patil", "Suresh Jadhav", "Ganesh More", "Manoj Shinde", "Rajesh Pawar",
    "Sanjay Deshmukh", "Vikram Kulkarni", "Anil Bhosale", "Prakash Gaikwad", "Dinesh Kale",
    "Sunil Chavan", "Sachin Wagh", "Mahesh Dhas", "Umesh Salunkhe", "Ravi Thorat",
]

BREEDS = {
    "Cattle (Cow)": ["Gir", "Sahiwal", "Kankrej", "Red Sindhi", "Deoni", "Khillari", "Dangi"],
    "Buffalo": ["Murrah", "Jaffarabadi", "Surti", "Mehsana", "Pandharpuri", "Nagpuri"],
    "Goat": ["Sirohi", "Jamnapari", "Barbari", "Osmanabadi", "Sangamneri", "Berari"],
    "Sheep": ["Deccani", "Madgyal", "Lonand", "Kolhapuri"],
    "Poultry": ["Kadaknath", "Aseel", "Giriraja", "Vanaraja"],
}


def seed_database(db: Session):
    """Seed database with Maharashtra livestock demo data."""
    if db.query(User).first() is not None:
        return  # Already seeded

    print("[SEED] Seeding PASHURAKSHA AI database with Maharashtra demo data...")

    # ─── USERS ───
    users = []
    # Farmers (15)
    for i, name in enumerate(FARMER_NAMES):
        v = VILLAGES[i % len(VILLAGES)]
        farmer = User(
            id=f"usr-farmer-{i+1}",
            name=name,
            phone=f"98765{43210+i}",
            email=f"farmer{i+1}@pashuraksha.ai",
            password_hash="hashed_demo_password",
            role="farmer",
            village=v["name"],
            district=v["district"],
            state="Maharashtra",
            latitude=v["lat"] + random.uniform(-0.01, 0.01),
            longitude=v["lng"] + random.uniform(-0.01, 0.01),
        )
        users.append(farmer)

    # Veterinarians (4)
    vet_data = [
        ("Dr. Priya Sharma", "Baramati", "Pune"), ("Dr. Arun Joshi", "Sinnar", "Nashik"),
        ("Dr. Meena Kulkarni", "Shrigonda", "Ahmednagar"), ("Dr. Sagar Patil", "Karad", "Satara"),
    ]
    for i, (name, village, district) in enumerate(vet_data):
        v_geo = next((v for v in VILLAGES if v["name"] == village), VILLAGES[0])
        vet = User(
            id=f"usr-vet-{i+1}", name=name, phone=f"98765{43220+i}",
            email=f"vet{i+1}@pashuraksha.ai", password_hash="hashed_demo_password",
            role="veterinarian", village=village, district=district,
            state="Maharashtra", latitude=v_geo["lat"], longitude=v_geo["lng"],
        )
        users.append(vet)

    # Field Workers (3)
    fw_data = [
        ("Ankita Jadhav", "Baramati", "Pune"), ("Rohit Gaikwad", "Sinnar", "Nashik"),
        ("Prashant Mane", "Shrigonda", "Ahmednagar"),
    ]
    for i, (name, village, district) in enumerate(fw_data):
        v_geo = next((v for v in VILLAGES if v["name"] == village), VILLAGES[0])
        fw = User(
            id=f"usr-fw-{i+1}", name=name, phone=f"98765{43250+i}",
            email=f"fieldworker{i+1}@pashuraksha.ai", password_hash="hashed_demo_password",
            role="field_worker", village=village, district=district,
            state="Maharashtra", latitude=v_geo["lat"], longitude=v_geo["lng"],
        )
        users.append(fw)

    # Lab Technicians (2)
    lab_data = [("Dr. Suhas Kulkarni", "Pune Lab", "Pune"), ("Dr. Rajan Nair", "Nashik Lab", "Nashik")]
    for i, (name, village, district) in enumerate(lab_data):
        lab = User(
            id=f"usr-lab-{i+1}", name=name, phone=f"98765{43240+i}",
            email=f"lab{i+1}@pashuraksha.ai", password_hash="hashed_demo_password",
            role="laboratory", village=village, district=district,
            state="Maharashtra", latitude=18.5204, longitude=73.8567,
        )
        users.append(lab)

    # Government Officials (2)
    gov_data = [("S. Deshmukh (IAS)", "Pune HQ", "Pune"), ("M. Kadam", "Nashik HQ", "Nashik")]
    for i, (name, village, district) in enumerate(gov_data):
        gov = User(
            id=f"usr-auth-{i+1}", name=name, phone=f"98765{43230+i}",
            email=f"officer{i+1}@pashuraksha.ai", password_hash="hashed_demo_password",
            role="authority", village=village, district=district,
            state="Maharashtra", latitude=18.5204, longitude=73.8567,
        )
        users.append(gov)

    # Admin
    admin = User(
        id="usr-admin-1", name="System Admin", phone="9876500000",
        email="admin@pashuraksha.ai", password_hash="hashed_demo_password",
        role="admin", village="Pune", district="Pune", state="Maharashtra",
        latitude=18.5204, longitude=73.8567,
    )
    users.append(admin)

    db.add_all(users)
    db.commit()

    # ─── FARMS (30+) ───
    farms = []
    farm_idx = 0
    for farmer in users[:15]:
        v = next((v for v in VILLAGES if v["name"] == farmer.village), VILLAGES[0])
        for j in range(random.randint(1, 3)):
            farm_idx += 1
            farm = Farm(
                id=f"farm-{farm_idx:03d}",
                name=f"{farmer.name.split()[0]} Farm {j+1}" if j > 0 else f"{farmer.name.split()[0]} Farm",
                owner_id=farmer.id, owner_name=farmer.name,
                village=farmer.village, taluka=v["taluka"], district=v["district"],
                state="Maharashtra",
                latitude=v["lat"] + random.uniform(-0.005, 0.005),
                longitude=v["lng"] + random.uniform(-0.005, 0.005),
                total_animals=random.randint(5, 25),
            )
            farms.append(farm)
    db.add_all(farms)
    db.commit()

    # ─── ANIMALS (120+) ───
    animals = []
    anim_idx = 0
    species_list = list(BREEDS.keys())
    species_weights = [0.35, 0.25, 0.20, 0.12, 0.08]
    prefixes = {"Cattle (Cow)": "COW", "Buffalo": "BUF", "Goat": "GOAT", "Sheep": "SHP", "Poultry": "PLT"}

    for farmer in users[:15]:
        num_animals = random.randint(5, 15)
        for _ in range(num_animals):
            anim_idx += 1
            species = random.choices(species_list, weights=species_weights, k=1)[0]
            breed = random.choice(BREEDS[species])
            prefix = prefixes[species]
            risk_score = random.choices([random.uniform(0, 25), random.uniform(26, 50), random.uniform(51, 75), random.uniform(76, 100)], weights=[0.5, 0.25, 0.15, 0.1], k=1)[0]
            risk_level = "LOW" if risk_score < 30 else "MODERATE" if risk_score < 60 else "HIGH" if risk_score < 80 else "CRITICAL"

            animal = Animal(
                id=f"anim-{anim_idx:03d}",
                animal_id=f"{prefix}-{100+anim_idx}",
                owner_id=farmer.id, owner_name=farmer.name,
                species=species, breed=breed,
                age=round(random.uniform(0.5, 12), 1),
                gender=random.choice(["male", "female", "female", "female"]),
                weight=round(random.uniform(30, 600), 1) if species != "Poultry" else round(random.uniform(1.5, 4.5), 1),
                vaccination_status=random.choice(["Up to date", "Up to date", "Due soon", "Overdue"]),
                previous_diseases=random.choice(["None", "None", "None", "Mild fever (treated)", "Mastitis (treated)", "FMD (recovered)"]),
                milk_production=round(random.uniform(5, 20), 1) if species in ("Cattle (Cow)", "Buffalo") and random.random() > 0.3 else 0,
                village=farmer.village, district=farmer.district,
                current_risk_score=round(risk_score, 1),
                current_risk_level=risk_level,
            )
            animals.append(animal)
    db.add_all(animals)
    db.commit()

    # ─── VACCINATIONS (60+) ───
    vaccines_list = [
        ("FMD (Foot & Mouth Disease)", 180), ("HS + BQ Combined", 180),
        ("Brucellosis S19", 365), ("Anthrax", 365), ("PPR", 365),
        ("Black Quarter", 180), ("Theileriosis", 365),
    ]
    vaccinations = []
    for i, animal in enumerate(animals[:80]):
        num_vac = random.randint(1, 3)
        for j in range(num_vac):
            vaccine_name, interval = random.choice(vaccines_list)
            days_ago = random.randint(10, 300)
            vac = Vaccination(
                id=f"vac-{len(vaccinations)+1:03d}",
                animal_id=animal.animal_id,
                vaccine_name=vaccine_name,
                vaccination_date=date.today() - timedelta(days=days_ago),
                next_due_date=date.today() - timedelta(days=days_ago) + timedelta(days=interval),
                status="completed" if days_ago > 30 else "due",
                notes=f"Administered by veterinary team at {animal.village}",
            )
            vaccinations.append(vac)
    db.add_all(vaccinations)
    db.commit()

    # ─── HEALTH REPORTS (30+) with varying risk levels ───
    reports = []
    symptom_combos = [
        {"fever": True, "cough": True, "reduced_appetite": True, "severity": "severe", "concern": "Possible Bovine Respiratory Disease"},
        {"fever": True, "lesions": True, "salivation": True, "severity": "severe", "concern": "Possible Foot-and-Mouth Disease (FMD)"},
        {"fever": True, "swelling": True, "difficulty_breathing": True, "severity": "severe", "concern": "Possible Hemorrhagic Septicemia"},
        {"diarrhea": True, "lethargy": True, "reduced_appetite": True, "severity": "moderate", "concern": "Possible Enteric Disease"},
        {"fever": True, "reduced_milk": True, "severity": "moderate", "concern": "Possible Mastitis or Metabolic Issue"},
        {"cough": True, "nasal_discharge": True, "severity": "mild", "concern": "Possible Upper Respiratory Infection"},
        {"lethargy": True, "reduced_appetite": True, "severity": "mild", "concern": "Possible Nutritional Deficiency"},
        {"fever": True, "difficulty_breathing": True, "cough": True, "severity": "severe", "concern": "Acute Respiratory Complex"},
    ]

    report_villages = ["Baramati", "Baramati", "Baramati", "Shirur", "Shirur", "Sinnar",
                       "Shrigonda", "Indapur", "Karad", "Karvir", "Junnar", "Parner",
                       "Baramati", "Shirur", "Baramati"]

    for i in range(30):
        combo = symptom_combos[i % len(symptom_combos)]
        village_name = report_villages[i % len(report_villages)]
        v_geo = next((v for v in VILLAGES if v["name"] == village_name), VILLAGES[0])
        farmer = next((u for u in users[:15] if u.village == village_name), users[0])
        animal = next((a for a in animals if a.village == village_name), animals[0])
        days_ago = random.randint(0, 14)

        risk_score = random.uniform(30, 95) if combo["severity"] == "severe" else random.uniform(15, 65)
        risk_level = "LOW" if risk_score < 30 else "MODERATE" if risk_score < 60 else "HIGH" if risk_score < 80 else "CRITICAL"
        num_affected = random.randint(1, 6) if combo["severity"] == "severe" else random.randint(1, 3)

        report = HealthReport(
            id=f"rep-{i+101}",
            animal_id=animal.animal_id,
            reported_by=farmer.id, reporter_name=farmer.name,
            species=animal.species,
            fever=combo.get("fever", False), cough=combo.get("cough", False),
            nasal_discharge=combo.get("nasal_discharge", False),
            reduced_appetite=combo.get("reduced_appetite", False),
            diarrhea=combo.get("diarrhea", False), lethargy=combo.get("lethargy", False),
            reduced_milk=combo.get("reduced_milk", False),
            difficulty_breathing=combo.get("difficulty_breathing", False),
            salivation=combo.get("salivation", False), lesions=combo.get("lesions", False),
            swelling=combo.get("swelling", False),
            severity=combo["severity"],
            duration_days=random.randint(1, 7),
            number_of_animals_affected=num_affected,
            latitude=v_geo["lat"] + random.uniform(-0.005, 0.005),
            longitude=v_geo["lng"] + random.uniform(-0.005, 0.005),
            village=village_name, district=v_geo["district"],
            risk_score=round(risk_score, 1), risk_level=risk_level,
            possible_disease_concern=combo["concern"],
            recommendation="Veterinary assessment recommended. Isolate affected animals." if risk_level in ("HIGH", "CRITICAL") else "Monitor and report if symptoms worsen.",
            reported_at=datetime.utcnow() - timedelta(days=days_ago),
        )
        reports.append(report)
    db.add_all(reports)
    db.commit()

    # ─── RISK ASSESSMENTS for high-risk reports ───
    risk_assessments = []
    for report in reports:
        if report.risk_score >= 50:
            ra = RiskAssessment(
                id=f"risk-{report.id.split('-')[1]}",
                report_id=report.id, animal_id=report.animal_id,
                risk_score=report.risk_score, risk_level=report.risk_level,
                possible_disease_concern=report.possible_disease_concern,
                disease_risk_score=round(report.risk_score * 0.95, 1),
                contributing_factors=[
                    {"factor": "Clinical symptoms detected", "weight_contribution": 20.0, "category": "Symptoms"},
                    {"factor": f"{report.number_of_animals_affected} animals affected", "weight_contribution": 15.0, "category": "Spread"},
                    {"factor": "Nearby similar cases reported", "weight_contribution": 12.0, "category": "Spatial"},
                    {"factor": "Monsoon season environmental risk", "weight_contribution": 8.0, "category": "Environmental"},
                ],
                recommendation=report.recommendation,
                cluster_detected=report.risk_level in ("HIGH", "CRITICAL"),
                cluster_name=f"{report.village} Cluster" if report.risk_level == "CRITICAL" else None,
            )
            risk_assessments.append(ra)
    db.add_all(risk_assessments)
    db.commit()

    # ─── OUTBREAK CLUSTERS (3) ───
    clusters = [
        OutbreakCluster(
            id="clust-001", cluster_name="Baramati Respiratory Outbreak Cluster",
            disease_concern="Possible Bovine Respiratory Disease Cluster",
            latitude=18.1515, longitude=74.5772, radius_km=2.8,
            case_count=14, affected_animals_count=23, cluster_score=82.0,
            risk_level="CRITICAL",
            dominant_symptoms=["Fever", "Cough", "Reduced Appetite", "Difficulty Breathing"],
            affected_villages=["Baramati"],
            status="active",
            recommended_action="Establish 5km containment zone. Deploy rapid response team. Ring vaccination for HS+BQ. Restrict animal movement.",
        ),
        OutbreakCluster(
            id="clust-002", cluster_name="Shirur Vesicular Disease Watch",
            disease_concern="Possible FMD Cluster Under Investigation",
            latitude=18.8264, longitude=74.3789, radius_km=1.5,
            case_count=6, affected_animals_count=9, cluster_score=65.0,
            risk_level="HIGH",
            dominant_symptoms=["Fever", "Lesions", "Salivation"],
            affected_villages=["Shirur"],
            status="investigating",
            recommended_action="Investigate. Collect epithelial samples for FMD testing. Check vaccination history of affected animals.",
        ),
        OutbreakCluster(
            id="clust-003", cluster_name="Shrigonda Enteric Monitoring",
            disease_concern="Enteric Disease Monitoring Zone",
            latitude=18.6155, longitude=74.6978, radius_km=1.0,
            case_count=4, affected_animals_count=5, cluster_score=42.0,
            risk_level="MODERATE",
            dominant_symptoms=["Diarrhea", "Reduced Appetite", "Lethargy"],
            affected_villages=["Shrigonda"],
            status="investigating",
            recommended_action="Monitor water sources. Check for parasitic load. Advise farmers on water hygiene.",
        ),
    ]
    db.add_all(clusters)
    db.commit()

    # ─── LAB REFERRALS (8) ───
    lab_referrals = [
        LabReferral(id="lab-001", case_id="rep-101", report_id="rep-101", animal_id="COW-101",
                    sample_type="Nasal Swab", test_requested="RT-PCR for BVD/IBR",
                    priority="high", veterinarian_id="usr-vet-1", veterinarian_name="Dr. Priya Sharma",
                    village="Baramati", district="Pune", status="completed", result="positive",
                    result_notes="BVD virus RNA detected. Recommend isolation and supportive treatment.",
                    result_date=datetime.utcnow() - timedelta(days=2)),
        LabReferral(id="lab-002", case_id="rep-102", report_id="rep-102", animal_id="BUF-102",
                    sample_type="Epithelial Swab", test_requested="FMD Virus Typing (ELISA + RT-PCR)",
                    priority="urgent", veterinarian_id="usr-vet-1", veterinarian_name="Dr. Priya Sharma",
                    village="Baramati", district="Pune", status="processing", result="pending"),
        LabReferral(id="lab-003", case_id="rep-104", report_id="rep-104", animal_id="GOAT-104",
                    sample_type="Blood (EDTA)", test_requested="Pasteurella multocida Culture",
                    priority="high", veterinarian_id="usr-vet-2", veterinarian_name="Dr. Arun Joshi",
                    village="Shirur", district="Pune", status="received", result="pending"),
        LabReferral(id="lab-004", case_id="rep-105", report_id="rep-105", animal_id="COW-105",
                    sample_type="Milk Sample", test_requested="California Mastitis Test + Culture",
                    priority="normal", veterinarian_id="usr-vet-1", veterinarian_name="Dr. Priya Sharma",
                    village="Sinnar", district="Nashik", status="completed", result="positive",
                    result_notes="Staphylococcus aureus isolated. Antibiotic sensitivity: Ceftriaxone sensitive.",
                    result_date=datetime.utcnow() - timedelta(days=5)),
        LabReferral(id="lab-005", case_id="rep-108", report_id="rep-108", animal_id="SHP-108",
                    sample_type="Fecal Sample", test_requested="Parasitology (Flotation + Sedimentation)",
                    priority="normal", veterinarian_id="usr-vet-3", veterinarian_name="Dr. Meena Kulkarni",
                    village="Shrigonda", district="Ahmednagar", status="completed", result="negative",
                    result_notes="No significant parasitic load detected.",
                    result_date=datetime.utcnow() - timedelta(days=3)),
        LabReferral(id="lab-006", case_id="rep-113", report_id="rep-113", animal_id="BUF-113",
                    sample_type="Blood (Serum)", test_requested="Brucella Serology (RBPT + ELISA)",
                    priority="high", veterinarian_id="usr-vet-1", veterinarian_name="Dr. Priya Sharma",
                    village="Baramati", district="Pune", status="pending", result="pending"),
        LabReferral(id="lab-007", case_id="rep-110", report_id="rep-110", animal_id="COW-110",
                    sample_type="Nasal Swab", test_requested="Bacterial Culture + Sensitivity",
                    priority="normal", veterinarian_id="usr-vet-4", veterinarian_name="Dr. Sagar Patil",
                    village="Karad", district="Satara", status="processing", result="pending"),
        LabReferral(id="lab-008", case_id="rep-114", report_id="rep-114", animal_id="GOAT-114",
                    sample_type="Blood (EDTA)", test_requested="PPR Virus Detection (RT-PCR)",
                    priority="high", veterinarian_id="usr-vet-2", veterinarian_name="Dr. Arun Joshi",
                    village="Shirur", district="Pune", status="pending", result="pending"),
    ]
    db.add_all(lab_referrals)
    db.commit()

    # ─── CASE TIMELINE EVENTS ───
    timeline_events = [
        # Case rep-101 full timeline
        CaseTimelineEvent(case_id="rep-101", event_type="report_created", title="Health Report Filed",
                          description="Farmer Ramesh Patil reported fever, cough, reduced appetite for COW-101.",
                          actor_name="Ramesh Patil", actor_role="farmer",
                          created_at=datetime.utcnow() - timedelta(days=7)),
        CaseTimelineEvent(case_id="rep-101", event_type="ai_triage", title="AI Risk Assessment: HIGH (72/100)",
                          description="Risk engine detected respiratory symptom pattern. Possible BRD.",
                          actor_name="PASHURAKSHA AI", actor_role="system",
                          created_at=datetime.utcnow() - timedelta(days=7, hours=-1)),
        CaseTimelineEvent(case_id="rep-101", event_type="risk_identified", title="High Risk Alert Generated",
                          description="Alert dispatched to veterinarian and authority.",
                          actor_name="Alert Engine", actor_role="system",
                          created_at=datetime.utcnow() - timedelta(days=7, hours=-2)),
        CaseTimelineEvent(case_id="rep-101", event_type="vet_assigned", title="Veterinarian Assigned",
                          description="Dr. Priya Sharma assigned to investigate case.",
                          actor_name="Dr. Priya Sharma", actor_role="veterinarian",
                          created_at=datetime.utcnow() - timedelta(days=6)),
        CaseTimelineEvent(case_id="rep-101", event_type="field_visit", title="Field Visit Conducted",
                          description="Physical examination confirmed respiratory distress. Temperature: 104.2°F.",
                          actor_name="Ankita Jadhav", actor_role="field_worker",
                          created_at=datetime.utcnow() - timedelta(days=5)),
        CaseTimelineEvent(case_id="rep-101", event_type="sample_collected", title="Sample Collected & Sent to Lab",
                          description="Nasal swab collected for RT-PCR testing. Priority: HIGH.",
                          actor_name="Dr. Priya Sharma", actor_role="veterinarian",
                          created_at=datetime.utcnow() - timedelta(days=5, hours=-2)),
        CaseTimelineEvent(case_id="rep-101", event_type="lab_result", title="Lab Result: POSITIVE (BVD)",
                          description="BVD virus RNA detected by RT-PCR. Isolation and supportive treatment recommended.",
                          actor_name="Dr. Suhas Kulkarni", actor_role="laboratory",
                          created_at=datetime.utcnow() - timedelta(days=2)),
        CaseTimelineEvent(case_id="rep-101", event_type="treatment", title="Treatment Initiated",
                          description="Antipyretic + antibiotic therapy started. Animal isolated from herd.",
                          actor_name="Dr. Priya Sharma", actor_role="veterinarian",
                          created_at=datetime.utcnow() - timedelta(days=2, hours=-4)),
        # Case rep-102 partial timeline
        CaseTimelineEvent(case_id="rep-102", event_type="report_created", title="Health Report Filed",
                          description="Lesions and salivation reported in buffalo. Possible FMD.",
                          actor_name="Suresh Jadhav", actor_role="farmer",
                          created_at=datetime.utcnow() - timedelta(days=4)),
        CaseTimelineEvent(case_id="rep-102", event_type="ai_triage", title="AI Risk Assessment: CRITICAL (88/100)",
                          description="Vesicular triad detected. FMD pattern match. URGENT veterinary action needed.",
                          actor_name="PASHURAKSHA AI", actor_role="system",
                          created_at=datetime.utcnow() - timedelta(days=4, hours=-1)),
        CaseTimelineEvent(case_id="rep-102", event_type="sample_collected", title="Epithelial Sample Collected",
                          description="Epithelial swab sent for FMD virus typing.",
                          actor_name="Dr. Priya Sharma", actor_role="veterinarian",
                          created_at=datetime.utcnow() - timedelta(days=3)),
    ]
    db.add_all(timeline_events)
    db.commit()

    # ─── ALERTS (multi-tier) ───
    alerts = [
        Alert(id="alt-001", user_id="usr-farmer-1", target_role="farmer", alert_type="cluster_warning",
              title="⚠️ Elevated Livestock Health Risk in Baramati",
              message="Multiple similar health reports detected in your area. Check your animals for fever, cough, or breathing difficulty. Report any new symptoms immediately.",
              risk_level="CRITICAL", related_cluster_id="clust-001", village="Baramati"),
        Alert(id="alt-002", user_id="usr-vet-1", target_role="veterinarian", alert_type="vet_triage",
              title="🔴 CRITICAL Case: Baramati Respiratory Cluster",
              message="14 cases with 23 affected animals detected in Baramati. Cluster score: 82/100. Immediate field investigation and containment action required.",
              risk_level="CRITICAL", related_cluster_id="clust-001", village="Baramati"),
        Alert(id="alt-003", user_id="usr-auth-1", target_role="authority", alert_type="surveillance_cluster",
              title="🚨 CRITICAL Outbreak Cluster: Baramati, Pune",
              message="Spatial clustering detected 14 cases within 2.8 km in Baramati. 23 animals affected with 3 mortalities. Ring vaccination and containment zone recommended.",
              risk_level="CRITICAL", related_cluster_id="clust-001", village="Baramati"),
        Alert(id="alt-004", user_id="usr-vet-1", target_role="veterinarian", alert_type="vet_triage",
              title="🟠 HIGH Priority: Shirur FMD Investigation",
              message="6 cases with vesicular lesions detected in Shirur. Possible FMD. Epithelial samples needed for confirmation.",
              risk_level="HIGH", related_cluster_id="clust-002", village="Shirur"),
        Alert(id="alt-005", user_id="usr-farmer-4", target_role="farmer", alert_type="vaccination_reminder",
              title="💉 Vaccination Due: HS+BQ Pre-Monsoon Booster",
              message="Your animals are due for Hemorrhagic Septicemia + Black Quarter vaccination. Contact your nearest veterinary center.",
              risk_level="MODERATE", village="Shirur"),
        Alert(id="alt-006", user_id="usr-auth-1", target_role="authority", alert_type="vaccination_gap",
              title="📊 Vaccination Coverage Below Target: Baramati",
              message="Baramati village vaccination coverage at 72.5%, below the 90% target. Prioritize vaccination campaign.",
              risk_level="HIGH", village="Baramati"),
        Alert(id="alt-007", user_id="usr-lab-1", target_role="laboratory", alert_type="lab_priority",
              title="🔬 URGENT Sample: FMD Typing Required",
              message="Epithelial swab from Baramati requires urgent FMD virus typing. 6 animals showing vesicular lesions.",
              risk_level="HIGH", related_cluster_id="clust-002", village="Baramati"),
        Alert(id="alt-008", user_id="usr-fw-1", target_role="field_worker", alert_type="field_assignment",
              title="📋 New Field Assignment: Baramati Farms",
              message="3 farms in Baramati require immediate field visits. Collect samples and assess herd health.",
              risk_level="HIGH", village="Baramati"),
    ]
    db.add_all(alerts)
    db.commit()

    # ─── NOTIFICATIONS ───
    notifications = [
        Notification(user_id="usr-farmer-1", target_role="farmer", category="health_alert",
                     title="Health Alert: Baramati Area", message="Multiple livestock health reports in your village. Monitor your animals closely.",
                     priority="high", related_id="clust-001", related_type="cluster"),
        Notification(user_id="usr-vet-1", target_role="veterinarian", category="vet_action",
                     title="New Case Assignment", message="High-priority case in Baramati requires your attention.",
                     priority="high", related_id="rep-101", related_type="report"),
        Notification(user_id="usr-auth-1", target_role="authority", category="cluster_warning",
                     title="Cluster Alert: Baramati", message="Critical outbreak cluster detected. Review surveillance dashboard.",
                     priority="urgent", related_id="clust-001", related_type="cluster"),
        Notification(user_id="usr-lab-1", target_role="laboratory", category="lab_update",
                     title="New Sample Received", message="Urgent FMD typing sample from Baramati received.",
                     priority="high", related_id="lab-002", related_type="lab_referral"),
        Notification(target_role="farmer", category="vaccination",
                     title="Vaccination Reminder", message="Pre-monsoon HS+BQ vaccination campaign starting next week.",
                     priority="normal"),
    ]
    db.add_all(notifications)
    db.commit()

    print(f"[SEED] Done: {len(users)} users, {len(farms)} farms, {len(animals)} animals, "
          f"{len(vaccinations)} vaccinations, {len(reports)} reports, "
          f"{len(clusters)} clusters, {len(lab_referrals)} lab referrals, "
          f"{len(timeline_events)} timeline events, {len(alerts)} alerts")
