from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import jwt
from cryptography.hazmat.primitives import serialization

_SUPABASE_PEM = (
    "-----BEGIN PUBLIC KEY-----\n"
    "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEe/cGAjlSBfGvBG5XmSqnfw/YEG+x\n"
    "kb1d7lg8Rz23/+RpwVZhL7Ou8xu+1/YxNeaU3uw/rwJG3JjeqlMUvQSzlQ==\n"
    "-----END PUBLIC KEY-----\n"
)


def _get_public_key():
    return serialization.load_pem_public_key(_SUPABASE_PEM.encode())


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if not request.url.path.startswith("/api/v1/admin"):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response(status_code=401, content="Unauthorized")

        token = auth_header.split(" ", 1)[1]
        try:
            public_key = _get_public_key()
            payload = jwt.decode(token, public_key, algorithms=["ES256"], audience="authenticated")
            request.state.user = payload
        except Exception:
            return Response(status_code=401, content="Unauthorized")

        return await call_next(request)