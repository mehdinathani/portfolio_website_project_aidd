"""
Generate embeddings for knowledge_base rows that have NULL or zero embeddings.
Uses gemini-embedding-001 (3072 dimensions).
"""
import sys
from pathlib import Path

_backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_backend_root))

from src.config import settings
from src.db.session import get_supabase
from src.services.gemini_service import generate_embedding
import time


def main():
    supabase = get_supabase()
    print("Fetching knowledge_base rows...")
    result = supabase.table("knowledge_base").select("id, content").execute()
    rows = result.data or []
    print(f"Found {len(rows)} rows.")

    for i, row in enumerate(rows):
        row_id = row["id"]
        content = row["content"]
        print(f"[{i+1}/{len(rows)}] Embedding: {content[:60]}...")

        try:
            embedding = generate_embedding(content)
            assert len(embedding) == 3072, f"Expected 3072 dims, got {len(embedding)}"
            supabase.table("knowledge_base").update({"embedding": embedding}).eq("id", row_id).execute()
            print(f"  -> Updated (3072 dims)")
            time.sleep(0.5)  # Rate limiting
        except Exception as e:
            print(f"  -> ERROR: {e}")

    print("Done!")


if __name__ == "__main__":
    main()
