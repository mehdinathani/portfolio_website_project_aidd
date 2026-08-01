"""Debug RAG by querying knowledge_base and match_knowledge directly."""
import sys
from pathlib import Path

_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from src.db.session import get_supabase
from src.services.gemini_service import generate_embedding

supabase = get_supabase()

result = supabase.table("knowledge_base").select("id, content, source, metadata").execute()
print(f"KB rows: {len(result.data)}")
for r in result.data:
    print(f"  {r['id'][:8]} source={r['source']:20s} {r['content'][:70]}...")

result2 = supabase.table("knowledge_base").select("id, embedding").limit(1).execute()
if result2.data:
    emb = result2.data[0]["embedding"]
    print(f"\nEmbedding type={type(emb).__name__}, len={len(emb) if isinstance(emb, list) else 'N/A'}")
    if isinstance(emb, list):
        print(f"  first 3 values: {emb[:3]}")

embedding = generate_embedding("certificates")
print(f"\nQuery embedding length: {len(embedding)}")

rpc_result = supabase.rpc("match_knowledge", {
    "query_embedding": embedding,
    "match_count": 5,
    "similarity_threshold": 0.7,
}).execute()

print(f"match_knowledge RPC returned {len(rpc_result.data)} results:")
for r in rpc_result.data:
    print(f"  sim={r['similarity']:.4f} source={r['source']:20s} content={r['content'][:60]}...")
