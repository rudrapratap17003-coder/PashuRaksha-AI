from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_authority
from app.models.user import User
from app.schemas.authority import (
    AuthorityDashboardSummary, 
    MapPoint, 
    TrendPoint, 
    AuthorityActionCreate,
    MvuUnit,
    MvuDispatchRequest,
    MvuDispatchResponse,
    MarketBiosecurityOverview,
    PermitVerificationRequest,
    PermitVerificationResponse
)
from app.services.authority_service import AuthorityService
from app.services.case_service import CaseService, CaseStatus
from app.models.health_report import HealthReport

router = APIRouter(prefix="/authority", tags=["Authority Surveillance & Hotspots"])

@router.get("/dashboard", response_model=AuthorityDashboardSummary)
def get_authority_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    """
    District epidemic KPIs, containment status, and biosecurity ring zones.
    Authorized: Authority officials and Admins only.
    """
    return AuthorityService.get_dashboard_summary(db)

@router.get("/map-data", response_model=List[MapPoint])
def get_surveillance_map_points(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    return AuthorityService.get_map_points(db)

@router.get("/trends", response_model=List[TrendPoint])
def get_epidemic_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    return AuthorityService.get_trends(db)

@router.get("/mvu-fleet", response_model=List[MvuUnit])
def get_mvu_fleet(
    current_user: User = Depends(require_authority)
):
    """Returns real-time GPS and cold-chain telemetry for 1962 MVU fleet."""
    return AuthorityService.get_mvu_fleet()

@router.post("/mvu-fleet/dispatch", response_model=MvuDispatchResponse)
def dispatch_mvu_unit(
    dispatch_in: MvuDispatchRequest,
    current_user: User = Depends(require_authority)
):
    """Emergency 1962 SOS dispatch to outbreak hotspot or containment cordon."""
    return AuthorityService.dispatch_mvu(
        unit_id=dispatch_in.unit_id,
        destination=dispatch_in.destination,
        priority=dispatch_in.priority or "EMERGENCY_SOS",
        notes=dispatch_in.notes
    )

@router.get("/market-biosecurity", response_model=MarketBiosecurityOverview)
def get_market_biosecurity(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    """APMC market biosecurity status, active embargoes, and transit inspection logs."""
    return AuthorityService.get_market_biosecurity(db)

@router.post("/market-biosecurity/verify-permit", response_model=PermitVerificationResponse)
def verify_transit_permit(
    verify_in: PermitVerificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    """Gatekeeper inspection check against active outbreak containment zones."""
    return AuthorityService.verify_permit(db, verify_in.permit_id_or_code)

@router.post("/cases/{case_id}/review")
def review_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    """Authority official initiates formal epidemic case review."""
    return CaseService.transition_status(
        db, case_id, CaseStatus.AUTHORITY_REVIEW.value,
        actor_name=current_user.name or "District Animal Husbandry Officer",
        actor_role="authority",
        action="Authority Epidemiological Review Initiated",
        notes="Evaluating cluster risk, biosecurity measures, and response readiness."
    )

@router.post("/cases/{case_id}/action")
def execute_authority_action(
    case_id: str,
    action_in: AuthorityActionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    """Authority official orders containment, rapid response team, or advisory broadcast."""
    target_st = action_in.target_status or CaseStatus.ACTION_TAKEN.value
    return CaseService.transition_status(
        db, case_id, target_st,
        actor_name=current_user.name or "District Animal Husbandry Officer",
        actor_role="authority",
        action=f"Authority Action: {action_in.action_type}",
        notes=action_in.notes or "Official response action executed."
    )

@router.post("/cases/{case_id}/close")
def close_case(
    case_id: str,
    notes: str = "Outbreak resolved, ring vaccination target achieved, animal recovered/isolated.",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_authority)
):
    """Authority official formally closes the resolved case."""
    return CaseService.transition_status(
        db, case_id, CaseStatus.CLOSED.value,
        actor_name=current_user.name or "District Animal Husbandry Officer",
        actor_role="authority",
        action="Case Formally Closed",
        notes=notes
    )
