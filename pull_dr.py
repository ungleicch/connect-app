from supabase import create_client
import json

SUPABASE_URL = "https://lzviyalhtfxmsaivwfaz.supabase.co"
SUPABASE_KEY = ""

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table("DR").select("*").execute()
print(json.dumps(response.data, indent=2, default=str))

import pandas as pd
df = pd.DataFrame(response.data)
df.to_csv("DR_export.csv", index=False)
print("Saved to DR_export.csv")
