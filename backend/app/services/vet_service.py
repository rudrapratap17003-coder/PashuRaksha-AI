from typing import List, Optional
from app.schemas.vet import VetCaseResponse, VetActionCreate
from app.services.store import store

class VetService:
    @staticmethod
    def get_priority_cases(status: Optional[str] = None) -> List[VetCaseResponse]:
        cases = list(store.vet_cases.values())
        if status:
            cases = [c for c in cases if c.get("status") == status]
        # Sort by risk_score descending
        cases = sorted(cases, key=lambda x: x.get("risk_score", 0), reverse=True)
        return [VetCaseResponse(**c) for c in cases]

    @staticmethod
    def add_action(case_id: str, action_in: VetActionCreate) -> Optional[VetCaseResponse]:
        case = store.vet_cases.get(case_id)
        if not case:
            return None
        case["status"] = action_in.status
        case["veterinary_notes"] = f"{action_in.action}: {action_in.notes or ''}".strip()
        case["lab_referral"] = action_in.lab_referral
        return VetCaseResponse(**case)
