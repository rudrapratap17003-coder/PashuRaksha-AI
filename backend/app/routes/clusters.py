from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_role
from app.models.user import User
from app.models.cluster import OutbreakCluster
from app.schemas.cluster import ClusterResponse
from app.services.cluster_service import ClusterService

router = APIRouter(prefix="/clusters", tags=["Outbreak Clusters & Early Warning"])
require_surveillance_role = require_role(["veterinarian", "authority", "admin"])

@router.get("", response_model=List[ClusterResponse])
def list_outbreak_clusters(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_surveillance_role)
):
    """
    List spatial-temporal disease clusters.
    Authorized: Veterinarians, Authorities, and Admins only.
    """
    return ClusterService.get_all(db)

@router.post("/run-detection", response_model=List[ClusterResponse])
def run_cluster_detection(
    window_days: int = 14,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_surveillance_role)
):
    """
    Triggers spatial-temporal Haversine clustering over active health reports (past 14 days by default)
    and updates outbreak clusters in the database.
    Authorized: Veterinarians, Authorities, and Admins only.
    """
    return ClusterService.run_detection(db, window_days=window_days)

@router.get("/{cluster_id}", response_model=ClusterResponse)
def get_outbreak_cluster(
    cluster_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_surveillance_role)
):
    cluster = ClusterService.get_by_id(db, cluster_id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Outbreak cluster not found")
    return cluster

@router.post("/{cluster_id}/action")
def trigger_cluster_action(
    cluster_id: str,
    action: str = "Deploy 250 Ring Vaccination Doses & Enact 5km Movement Barrier",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_surveillance_role)
):
    """
    Authority official or attending veterinarian triggers containment action for a detected cluster.
    """
    cluster = db.query(OutbreakCluster).filter(OutbreakCluster.id == cluster_id).first()
    if not cluster:
        raise HTTPException(status_code=404, detail="Outbreak cluster not found")
    
    # Broadcast alert and mark containment
    import uuid
    from app.models.alert import Alert
    db.add(Alert(
        id=f"alt-act-{str(uuid.uuid4())[:6]}",
        target_role="authority",
        alert_type="outbreak_action",
        title=f"Action Executed: {cluster.cluster_name}",
        message=f"{current_user.name or 'Officer'} executed: {action}. Containment perimeter active for {', '.join(cluster.affected_villages or ['Baramati'])}.",
        risk_level=cluster.risk_level,
        related_cluster_id=cluster.id,
        village=cluster.affected_villages[0] if cluster.affected_villages else "Baramati"
    ))
    cluster.status = "contained"
    db.commit()
    db.refresh(cluster)
    return {
        "status": "success",
        "cluster_id": cluster.id,
        "action_taken": action,
        "new_status": cluster.status,
        "containment_radius_km": cluster.radius_km
    }
