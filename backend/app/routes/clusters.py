from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.cluster import ClusterResponse
from app.services.cluster_service import ClusterService

router = APIRouter(prefix="/clusters", tags=["Outbreak Clusters & Early Warning"])

@router.get("", response_model=List[ClusterResponse])
def list_outbreak_clusters():
    return ClusterService.get_all()

@router.get("/{cluster_id}", response_model=ClusterResponse)
def get_outbreak_cluster(cluster_id: str):
    cluster = ClusterService.get_by_id(cluster_id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Outbreak cluster not found")
    return cluster
