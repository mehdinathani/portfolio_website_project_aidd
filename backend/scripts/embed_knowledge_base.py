"""Re-embed knowledge_base with proper pgvector format."""
import sys
from pathlib import Path

_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from src.db.session import get_supabase
from src.services.gemini_service import generate_embedding


def main():
    supabase = get_supabase()
    result = supabase.table("knowledge_base").select("id, content").execute()
    rows = result.data
    if not rows:
        print("No knowledge_base rows found.")
        return

    print(f"Found {len(rows)} rows to re-embed...")
    for i, row in enumerate(rows):
        try:
            embedding = generate_embedding(row["content"])
            # pgvector expects a string literal formatted as [x,y,z]
            vector_str = "[" + ",".join(str(v) for v in embedding) + "]"
            supabase.table("knowledge_base").update(
                {"embedding": vector_str}
            ).eq("id", row["id"]).execute()
            print(f"  [{i+1}/{len(rows)}] Embedded row {row['id'][:8]}...")
        except Exception as e:
            print(f"  [{i+1}/{len(rows)}] FAILED row {row['id'][:8]}: {e}")

    result2 = supabase.table("knowledge_base").select("id, embedding").limit(1).execute()
    if result2.data:
        print(f"  Sample embedding type={type(result2.data[0]['embedding']).__name__}")
        emb = result2.data[0]["embedding"]
        if isinstance(emb, str):
            print(f"  First 50 chars: {emb[:50]}...")

    print("Done.")


if __name__ == "__main__":
    main()
