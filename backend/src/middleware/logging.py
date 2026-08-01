import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = time.time() - start
        print(f"[LOG] {request.method} {request.url.path} -> {response.status_code} ({duration:.3f}s)")
        return response
