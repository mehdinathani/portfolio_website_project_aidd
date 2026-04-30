from threading import Lock
from time import time
from typing import Any, Tuple, Dict


class CacheService:
    def __init__(self, default_ttl: int = 300):
        self._cache: Dict[str, Tuple[Any, float]] = {}
        self._ttl = default_ttl
        self._lock = Lock()

    def get(self, key: str) -> Any:
        with self._lock:
            if key not in self._cache:
                return None
            value, expiry = self._cache[key]
            if time() > expiry:
                del self._cache[key]
                return None
            return value

    def set(self, key: str, value: Any, ttl: int = None) -> None:
        with self._lock:
            expiry = time() + (ttl if ttl is not None else self._ttl)
            self._cache[key] = (value, expiry)

    def invalidate(self, key: str) -> None:
        with self._lock:
            self._cache.pop(key, None)


cache_service = CacheService()
