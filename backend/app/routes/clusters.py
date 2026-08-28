from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.cluster import ClusterResponse
from app.services.cluster_service import ClusterService

router = APIRouter(prefix="/clusters", tags=["Outbreak Clusters & Early Warning"])

@router.get("", response_model=List[ClusterResponse])
def list_outbreak_clusters(db: Session = Depends(get_db)):
    return ClusterService.get_all(db)

@router.get("/{cluster_id}", response_model=ClusterResponse)
def get_outbreak_cluster(cluster_id: str, db: Session = Depends(get_db)):
    cluster = ClusterService.get_by_id(db, cluster_id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Outbreak cluster not found")
    return cluster
