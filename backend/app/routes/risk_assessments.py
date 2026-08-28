from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.risk_assessment import RiskAssessment
from app.schemas.risk_assessment import RiskAssessmentResponse

router = APIRouter(prefix="/risk-assessments", tags=["AI Risk Assessment & Explainability"])

@router.get("/{assessment_id}", response_model=RiskAssessmentResponse)
def get_risk_assessment(assessment_id: str, db: Session = Depends(get_db)):
    risk = db.query(RiskAssessment).filter(
        (RiskAssessment.id == assessment_id) | (RiskAssessment.report_id == assessment_id)
    ).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return RiskAssessmentResponse(
        id=risk.id,
        report_id=risk.report_id,
        animal_id=risk.animal_id,
        risk_score=risk.risk_score,
        risk_level=risk.risk_level,
        possible_disease_concern=risk.possible_disease_concern,
        disease_risk_score=risk.disease_risk_score,
        contributing_factors=risk.contributing_factors or [],
        recommendation=risk.recommendation,
        cluster_detected=risk.cluster_detected,
        cluster_name=risk.cluster_name,
        disclaimer=risk.disclaimer,
        created_at=risk.created_at
    )
