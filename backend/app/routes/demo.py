"""
SIH 2026 Demonstration Controller: Suspected FMD Outbreak in Baramati.
Provides deterministic state management, automated step progression, and safe database reset.
"""
from datetime import datetime, date, timedelta
from typing import Dict, Any, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.seed_service import reset_database
from app.services.health_report_service import HealthReportService
from app.services.lab_service import LabService
from app.services.timeline_service import TimelineService
from app.models.health_report import HealthReport
from app.models.lab_referral import LabReferral
from app.models.cluster import OutbreakCluster
from app.models.case_timeline import CaseTimelineEvent
from app.models.alert import Alert
from app.models.animal import Animal
from app.schemas.health_report import HealthReportCreate
from app.schemas.lab_referral import LabReferralCreate, LabReferralUpdate
from app.utils import get_logger, get_utc_now

logger = get_logger(__name__)

router = APIRouter(prefix="/demo", tags=["SIH Demo Orchestration"])


@router.post("/reset")
def reset_demo_scenario(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Deterministically resets the database to the clean baseline state.
    Restores demo cow COW-101 in Baramati owned by Ramesh Patil with overdue FMD booster.
    """
    result = reset_database(db)
    return {
        **result,
        "current_step": 1,
        "step_name": "STEP 1 — FARMER INTAKE",
        "description": "Demonstration scenario ready. Farmer Ramesh Patil can submit symptoms for COW-101 in Baramati."
    }


@router.get("/state")
def get_demo_state(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Inspects database to compute current demonstration stage (Steps 1 through 7).
    """
    # 1. Check for COW-101 report
    cow_report = db.query(HealthReport).filter(
        HealthReport.animal_id == "COW-101"
    ).order_by(HealthReport.reported_at.desc()).first()

    if not cow_report:
        return {
            "current_step": 1,
            "step_title": "Step 1: Farmer Symptom Reporting",
            "active_role": "farmer",
            "report_id": None,
            "referral_id": None,
            "cluster_id": None,
            "status": "ready_for_step_1",
            "message": "Baseline active. Submit symptom report for COW-101 to begin scenario."
        }

    # 2. Check for Lab Referral
    lab_ref = db.query(LabReferral).filter(
        (LabReferral.animal_id == "COW-101") | (LabReferral.case_id == cow_report.id) | (LabReferral.report_id == cow_report.id)
    ).first()

    # 3. Check for Baramati Outbreak Cluster
    cluster = db.query(OutbreakCluster).filter(
        OutbreakCluster.cluster_name.like("%Baramati%"),
        OutbreakCluster.disease_concern.like("%Foot-and-Mouth%")
    ).first()

    # 4. Check timeline events
    events = db.query(CaseTimelineEvent).filter(
        CaseTimelineEvent.case_id == cow_report.id
    ).all()
    event_types = {e.event_type for e in events}

    # Calculate step
    if cluster and cluster.risk_level == "CRITICAL" and lab_ref and lab_ref.result == "positive":
        step = 7
        title = "Step 7: Final Closed-Loop Impact & Surveillance Response"
        active_role = "authority"
    elif lab_ref and lab_ref.result == "positive":
        step = 6
        title = "Step 6: Health Authority Containment & 5km Ring Protocol"
        active_role = "authority"
    elif lab_ref and (lab_ref.status in ("processing", "received") or event_types.intersection({"forward_vet", "sample_collected"})):
        step = 5
        title = "Step 5: District Laboratory Diagnostic RT-PCR Confirmation"
        active_role = "laboratory"
    elif "forward_vet" in event_types or "field_visit" in event_types or "case_accepted" in event_types:
        step = 4
        title = "Step 4: Veterinarian Clinical Triage & Lab Escalation"
        active_role = "veterinarian"
    elif cow_report:
        step = 3
        title = "Step 3: Field Worker Rapid Farm Inspection & Sampling"
        active_role = "field_worker"
    else:
        step = 2
        title = "Step 2: AI Explainable Risk Engine Evaluation"
        active_role = "farmer"

    return {
        "current_step": step,
        "step_title": title,
        "active_role": active_role,
        "report": {
            "id": cow_report.id,
            "animal_id": cow_report.animal_id,
            "risk_score": cow_report.risk_score,
            "risk_level": cow_report.risk_level,
            "possible_disease_concern": cow_report.possible_disease_concern,
            "recommendation": cow_report.recommendation,
            "reported_at": cow_report.reported_at.isoformat() if cow_report.reported_at else None,
        },
        "referral": {
            "id": lab_ref.id if lab_ref else None,
            "sample_type": lab_ref.sample_type if lab_ref else None,
            "test_requested": lab_ref.test_requested if lab_ref else None,
            "status": lab_ref.status if lab_ref else None,
            "result": lab_ref.result if lab_ref else None,
            "priority": lab_ref.priority if lab_ref else None,
        } if lab_ref else None,
        "cluster": {
            "id": cluster.id if cluster else None,
            "cluster_name": cluster.cluster_name if cluster else None,
            "radius_km": cluster.radius_km if cluster else None,
            "risk_level": cluster.risk_level if cluster else None,
            "affected_animals_count": cluster.affected_animals_count if cluster else None,
            "recommended_action": cluster.recommended_action if cluster else None,
        } if cluster else None,
        "timeline_events_count": len(events)
    }


@router.post("/step/{step_num}")
def execute_demo_step(step_num: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Executes a deterministic step in the 7-stage Baramati FMD demonstration.
    Enables presenters to execute any phase instantly with live backend operations.
    """
    if step_num == 1:
        # Step 1: Farmer reports 7 clinical symptoms for COW-101 in Baramati
        report_data = HealthReportCreate(
            animal_id="COW-101",
            reported_by="usr-farmer-1",
            reporter_name="Ramesh Patil",
            fever=True,
            lesions=True,
            salivation=True,
            reduced_appetite=True,
            reduced_milk=True,
            cough=False,
            difficulty_breathing=False,
            diarrhea=False,
            lethargy=False,
            swelling=False,
            severity="severe",
            duration_days=2,
            number_of_animals_affected=3,
            village="Baramati",
            district="Pune",
            latitude=18.1515,
            longitude=74.5772,
            other_symptoms="[SIH DEMONSTRATION DATA] Vesicles observed inside oral mucosa and interdigital space. Profuse ropy salivation."
        )
        report = HealthReportService.create(db, report_data)
        
        # Add initial timeline event
        TimelineService.add_event(
            db, report.id, "report_created", "Health Symptom Report Filed",
            "Farmer Ramesh Patil lodged clinical symptoms: High fever, oral lesions, excessive drooling, sudden milk drop in COW-101 (3 herd animals affected).",
            "Ramesh Patil", "farmer"
        )
        TimelineService.add_event(
            db, report.id, "ai_triage", f"AI Risk Assessment: {report.risk_level} ({report.risk_score}/100)",
            f"Explainable multi-factor scoring: Vesicular Triad synergy (Fever + Lesions + Drooling), overdue FMD booster, and multi-animal contagion. Pattern match: {report.possible_disease_concern}.",
            "PASHURAKSHA AI Risk Engine", "system"
        )

        return {
            "status": "success",
            "step": 1,
            "title": "Step 1 & 2 Completed: Farmer Report Lodged & Risk Engine Evaluated",
            "report_id": report.id,
            "risk_score": report.risk_score,
            "risk_level": report.risk_level,
            "possible_disease_concern": report.possible_disease_concern,
            "next_step": 3,
            "instructions": "Log in as Field Worker (Ankita Jadhav) to inspect farm, collect oral swab, and forward to veterinarian."
        }

    # Find the active demo report
    cow_report = db.query(HealthReport).filter(
        HealthReport.animal_id == "COW-101"
    ).order_by(HealthReport.reported_at.desc()).first()

    if not cow_report:
        # If report not created yet, automatically run step 1 first
        execute_demo_step(1, db)
        cow_report = db.query(HealthReport).filter(
            HealthReport.animal_id == "COW-101"
        ).order_by(HealthReport.reported_at.desc()).first()

    if step_num == 3:
        # Step 3: Field Worker actions
        TimelineService.add_event(
            db, cow_report.id, "case_accepted", "Case Accepted for Field Inspection",
            "Field Worker Ankita Jadhav accepted case for immediate on-site verification in Baramati village.",
            "Ankita Jadhav", "field_worker"
        )
        TimelineService.add_event(
            db, cow_report.id, "field_visit", "Field Visit & Clinical Verification",
            "Physical examination confirms rectal temperature 104.4°F, extensive oral mucosal erosions, and profuse frothy salivation. Cow COW-101 isolated in separate enclosure.",
            "Ankita Jadhav", "field_worker"
        )
        TimelineService.add_event(
            db, cow_report.id, "sample_collected", "Oral Epithelial Swab Collected",
            "Collected sterile vesicular fluid scraping & oral mucosal swab under strict cold-chain transport protocol.",
            "Ankita Jadhav", "field_worker"
        )
        TimelineService.add_event(
            db, cow_report.id, "forward_vet", "Case Forwarded to Attending Veterinarian",
            "Urgent clinical referral sent to Dr. Priya Sharma (Baramati Veterinary Polyclinic) with high suspicion of vesicular aphthovirus.",
            "Ankita Jadhav", "field_worker"
        )
        return {
            "status": "success",
            "step": 3,
            "title": "Step 3 Completed: Field Worker Verified & Collected Bio-Sample",
            "case_id": cow_report.id,
            "next_step": 4,
            "instructions": "Log in as Veterinarian (Dr. Priya Sharma) to review timeline, clinical notes, and order diagnostic RT-PCR."
        }

    elif step_num == 4:
        # Step 4: Veterinarian actions
        TimelineService.add_event(
            db, cow_report.id, "vet_assigned", "Veterinary Clinical Investigation",
            "Dr. Priya Sharma conducted physical triage. Stomatitis and lingual erosions consistent with Foot-and-Mouth Disease. Supportive antiseptic mouthwash protocol initiated.",
            "Dr. Priya Sharma", "veterinarian"
        )

        # Create Lab Referral
        existing_ref = db.query(LabReferral).filter(LabReferral.animal_id == "COW-101").first()
        if not existing_ref:
            ref_create = LabReferralCreate(
                case_id=cow_report.id,
                report_id=cow_report.id,
                animal_id="COW-101",
                sample_type="Oral Epithelial Scraping / Swab",
                test_requested="RT-PCR for FMD Virus (Serotype Typing)",
                priority="urgent",
                veterinarian_name="Dr. Priya Sharma",
                village="Baramati",
                district="Pune"
            )
            lab_ref = LabService.create_referral(db, ref_create, vet_id="usr-vet-1")
            ref_id = lab_ref.id
        else:
            ref_id = existing_ref.id

        return {
            "status": "success",
            "step": 4,
            "title": "Step 4 Completed: Veterinarian Clinical Triage & Lab Order Created",
            "case_id": cow_report.id,
            "referral_id": ref_id,
            "next_step": 5,
            "instructions": "Log in as Laboratory (Dr. Suhas Kulkarni) to accession sample, run RT-PCR, and validate POSITIVE result."
        }

    elif step_num == 5:
        # Step 5: Laboratory actions
        lab_ref = db.query(LabReferral).filter(LabReferral.animal_id == "COW-101").first()
        if not lab_ref:
            # Run step 4 first
            execute_demo_step(4, db)
            lab_ref = db.query(LabReferral).filter(LabReferral.animal_id == "COW-101").first()

        update_data = LabReferralUpdate(
            status="completed",
            result="positive",
            result_notes="FMD virus serotype O detected by RT-PCR assay (Ct value: 21.4). High viral shedding. Immediate official reporting triggered."
        )
        LabService.update_referral(db, lab_ref.id, update_data)

        return {
            "status": "success",
            "step": 5,
            "title": "Step 5 Completed: Laboratory Validated POSITIVE (FMD Serotype O)",
            "referral_id": lab_ref.id,
            "result": "POSITIVE - FMD Serotype O",
            "next_step": 6,
            "instructions": "Log in as Authority (S. Deshmukh IAS) to observe Baramati Outbreak Cluster, 5km ring containment, and biosecurity dispatch."
        }

    elif step_num == 6 or step_num == 7:
        # Step 6 & 7: Authority Cluster Activation
        cluster = db.query(OutbreakCluster).filter(
            OutbreakCluster.cluster_name.like("%Baramati%")
        ).first()

        if not cluster:
            cluster = OutbreakCluster(
                id="clust-baramati-fmd",
                cluster_name="Baramati FMD Outbreak Cluster",
                disease_concern="Foot-and-Mouth Disease (FMD Serotype O Confirmed)",
                latitude=18.1515,
                longitude=74.5772,
                radius_km=5.0,
                case_count=8,
                affected_animals_count=14,
                cluster_score=94.0,
                risk_level="CRITICAL",
                dominant_symptoms=["Fever", "Oral Lesions", "Excessive Salivation", "Reduced Milk"],
                affected_villages=["Baramati", "Malegaon Bk", "Jalochi"],
                status="active",
                recommended_action="Establish 5.0 km ring containment perimeter. Deploy rapid response veterinary team with 250 FMD vaccine doses. Impose livestock movement restrictions and broadcast emergency biosecurity advisory.",
                detected_at=get_utc_now()
            )
            db.add(cluster)
        else:
            cluster.cluster_name = "Baramati FMD Outbreak Cluster"
            cluster.disease_concern = "Foot-and-Mouth Disease (FMD Serotype O Confirmed)"
            cluster.radius_km = 5.0
            cluster.risk_level = "CRITICAL"
            cluster.cluster_score = 94.0
            cluster.case_count = 8
            cluster.affected_animals_count = 14
            cluster.dominant_symptoms = ["Fever", "Oral Lesions", "Excessive Salivation", "Reduced Milk"]
            cluster.recommended_action = "Establish 5.0 km ring containment perimeter. Deploy rapid response veterinary team with 250 FMD vaccine doses. Impose livestock movement restrictions and broadcast emergency biosecurity advisory."

        # Add Authority Timeline Event
        TimelineService.add_event(
            db, cow_report.id, "authority_action", "District Outbreak Protocol Activated",
            "District Animal Husbandry Command established 5.0 km containment ring around Baramati centroid. Dispatched mobile veterinary response team with 250 ring-vaccine doses and broadcast SMS advisory.",
            "S. Deshmukh (IAS)", "authority"
        )
        db.commit()

        return {
            "status": "success",
            "step": step_num,
            "title": "Step 6 & 7 Completed: 5km Ring Containment Zone & Closed-Loop Response Active",
            "cluster_name": cluster.cluster_name,
            "radius_km": 5.0,
            "risk_level": "CRITICAL",
            "affected_animals": 14,
            "containment_action": cluster.recommended_action,
            "impact_statement": "From first symptom report to coordinated outbreak response in under 4 hours."
        }

    raise HTTPException(status_code=400, detail=f"Invalid demo step number: {step_num}")
