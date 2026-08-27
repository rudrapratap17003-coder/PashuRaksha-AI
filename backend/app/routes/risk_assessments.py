from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.risk_assessment import RiskAssessmentResponse
from app.services.store import store

router = APIRouter(prefix="/risk-assessments", tags=["AI Risk Assessment & Explainability"])

@router.get("/{assessment_id}", response_model=RiskAssessmentResponse)
def get_risk_assessment(assessment_id: str):
    # Lookup by assessment id or linked report_id
    for a in store.risk_assessments.values():
        if a["id"] == assessment_id or a["report_id"] == assessment_id:
            return RiskAssessmentResponse(**a)
    raise HTTPException(status_code=404, detail="Risk assessment not found")
