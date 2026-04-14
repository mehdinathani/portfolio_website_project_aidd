"""In-memory TTL cache — dict-based with configurable expiry."""

import time
import logging
from typing import Any, Optional

logger = logging.getLogger("portfolio.cache")


class TTLCache:
    """Simple in-memory cache with per-key TTL expiry."""

    def __init__(self, default_ttl: int = 300):
        """
        Args:
            default_ttl: Default time-to-live in seconds (5 minutes).
        """
        self.default_ttl = default_ttl
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache. Returns None if key doesn't exist or is expired."""
        if key not in self._store:
            return None

        value, expiry = self._store[key]
        if time.time() > expiry:
            # Key expired
            del self._store[key]
            return None

        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL."""
        ttl = ttl or self.default_ttl
        self._store[key] = (value, time.time() + ttl)

    def invalidate(self, key: str) -> bool:
        """Remove a key from cache. Returns True if key existed."""
        return self._store.pop(key, None) is not None

    def clear(self) -> None:
        """Clear all cached entries."""
        self._store.clear()

    def cleanup_expired(self) -> int:
        """Remove all expired entries. Returns count of removed keys."""
        now = time.time()
        expired = [k for k, (_, exp) in self._store.items() if now > exp]
        for k in expired:
            del self._store[k]
        return len(expired)


# Global cache instance — 5-minute default TTL
cache = TTLCache(default_ttl=300)
