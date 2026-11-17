from supabase import create_client
import json

SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_KEY = "YOUR_ANON_OR_SERVICE_ROLE_KEY"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table("DR").select("*").execute()
print(json.dumps(response.data, indent=2, default=str))
