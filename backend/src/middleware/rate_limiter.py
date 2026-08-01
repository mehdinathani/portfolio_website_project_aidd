from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from time import time
from threading import Lock


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rpm: int = 15):
        super().__init__(app)
        self.capacity = rpm
        self.refill_rate = rpm / 60.0  # tokens per second
        self.buckets = {}  # ip -> {"tokens": float, "last_refill": float}
        self.lock = Lock()
        self._cleanup_counter = 0

    def _cleanup_old_entries(self):
        """Periodically clean up buckets older than 5 minutes."""
        self._cleanup_counter += 1
        if self._cleanup_counter % 100 != 0:
            return
        now = time()
        stale = [
            ip for ip, b in self.buckets.items()
            if now - b["last_refill"] > 300
        ]
        for ip in stale:
            del self.buckets[ip]

    def _get_tokens(self, ip: str, now: float) -> float:
        bucket = self.buckets.get(ip)
        if bucket is None:
            return self.capacity
        elapsed = now - bucket["last_refill"]
        refilled = elapsed * self.refill_rate
        return min(self.capacity, bucket["tokens"] + refilled)

    async def dispatch(self, request, call_next):
        if request.url.path != "/api/v1/chat":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time()

        with self.lock:
            self._cleanup_old_entries()
            tokens = self._get_tokens(client_ip, now)
            if tokens < 1:
                retry_after = int(60 / self.capacity)
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Please try again later."},
                    headers={"Retry-After": str(retry_after)},
                )
            self.buckets[client_ip] = {
                "tokens": tokens - 1,
                "last_refill": now,
            }

        return await call_next(request)
