from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_role
from app.models.user import User
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
    db: Session = Depends(get_db),
    current_user: User = Depends(require_surveillance_role)
):
    """
    Triggers spatial-temporal Haversine clustering over active health reports (past 14 days)
    and updates outbreak clusters in the database.
    Authorized: Veterinarians, Authorities, and Admins only.
    """
    return ClusterService.run_detection(db)

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
