"""Token bucket rate limiter — in-memory, 15 tokens/min for chat endpoint."""

import time
from collections import defaultdict
from typing import Optional


class TokenBucket:
    """Simple in-memory token bucket rate limiter."""

    def __init__(self, rate: float = 15.0, capacity: Optional[int] = None):
        """
        Args:
            rate: Tokens added per minute (matches Gemini free tier 15 RPM).
            capacity: Max bucket size (defaults to rate).
        """
        self.rate = rate
        self.capacity = capacity or int(rate)
        self._tokens: dict[str, float] = {}
        self._last_refill: dict[str, float] = {}

    def _refill(self, key: str) -> None:
        now = time.time()
        if key not in self._last_refill:
            self._tokens[key] = float(self.capacity)
            self._last_refill[key] = now
            return

        elapsed = now - self._last_refill[key]
        new_tokens = elapsed * (self.rate / 60.0)
        self._tokens[key] = min(float(self.capacity), self._tokens.get(key, 0) + new_tokens)
        self._last_refill[key] = now

    def consume(self, key: str = "global") -> bool:
        """Try to consume one token. Returns True if allowed, False if rate limited."""
        self._refill(key)
        if self._tokens.get(key, 0) >= 1.0:
            self._tokens[key] -= 1.0
            return True
        return False

    def retry_after(self, key: str = "global") -> float:
        """Seconds until one token is available."""
        if self._tokens.get(key, 0) >= 1.0:
            return 0.0
        deficit = 1.0 - self._tokens.get(key, 0)
        return deficit / (self.rate / 60.0)


# Global rate limiter instance — 15 RPM
chat_rate_limiter = TokenBucket(rate=15.0, capacity=15)
