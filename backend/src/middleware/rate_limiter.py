from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from collections import defaultdict
from time import time
from threading import Lock


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rpm: int = 15):
        super().__init__(app)
        self.rpm = rpm
        self.tokens = defaultdict(lambda: {"count": 0, "reset_at": time() + 60})
        self.lock = Lock()

    async def dispatch(self, request, call_next):
        if request.url.path != "/api/v1/chat":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        with self.lock:
            now = time()
            state = self.tokens[client_ip]
            if now > state["reset_at"]:
                state["count"] = 0
                state["reset_at"] = now + 60
            if state["count"] >= self.rpm:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please try again later."},
                    headers={"Retry-After": "60"},
                )
            state["count"] += 1

        return await call_next(request)
