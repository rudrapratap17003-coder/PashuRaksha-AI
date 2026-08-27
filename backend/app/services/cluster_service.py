from typing import List, Optional
from app.schemas.cluster import ClusterResponse
from app.services.store import store

class ClusterService:
    @staticmethod
    def get_all() -> List[ClusterResponse]:
        return [ClusterResponse(**c) for c in store.clusters.values()]

    @staticmethod
    def get_by_id(cluster_id: str) -> Optional[ClusterResponse]:
        c = store.clusters.get(cluster_id)
        if c:
            return ClusterResponse(**c)
        return None
