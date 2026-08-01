"""One-off script: regenerate embeddings for every knowledge_base row.

Required after migration 012 (vector(768) -> vector(3072)) zeroed the column.
Uses google-genai's gemini-embedding-001 via the existing gemini_service.
"""
from __future__ import annotations

import sys

from src.db.session import get_supabase
from src.services.gemini_service import generate_embedding


def main() -> int:
    sb = get_supabase()
    rows = (
        sb.table("knowledge_base")
        .select("id, content")
        .execute()
        .data
        or []
    )
    if not rows:
        print("knowledge_base is empty; nothing to do.")
        return 0

    print(f"Re-embedding {len(rows)} rows...")
    failures = 0
    for r in rows:
        try:
            vec = generate_embedding(r["content"])
            if len(vec) != 3072:
                print(f"  ! {r['id']}: unexpected dim {len(vec)} (expected 3072)")
                failures += 1
                continue
            sb.table("knowledge_base").update({"embedding": vec}).eq("id", r["id"]).execute()
            print(f"  ✓ {r['id']}  ({r['content'][:60]}...)")
        except Exception as e:  # noqa: BLE001
            print(f"  ! {r['id']}: {e}")
            failures += 1

    print(f"Done. {len(rows) - failures}/{len(rows)} rows updated.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
