# Database Setup: Print Supabase Data in Terminal

Goal: Pull the existing `DR` table from Supabase and print the rows in your terminal.

The table already exists and contains the sample rows (ids 1–10).

## 1. Get credentials

In the Supabase dashboard click **Connect** (or Project Settings → API) and copy:

- **Project URL** — `https://xxxxxxxx.supabase.co`
- **anon public key** (or service_role key if you need to bypass RLS)

## 2. Local Python script

Create `pull_dr.py`:

```python
from supabase import create_client
import json

SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_KEY = "YOUR_ANON_OR_SERVICE_ROLE_KEY"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table("DR").select("*").execute()
print(json.dumps(response.data, indent=2, default=str))
```

Replace the two placeholder values with your real URL and key.

## 3. Install dependency and run

```bash
pip install supabase
python pull_dr.py
```

You should see the 10 rows printed as JSON in the terminal.

## Optional: save to CSV instead of printing

Add these lines at the bottom of the script:

```python
import pandas as pd
df = pd.DataFrame(response.data)
df.to_csv("DR_export.csv", index=False)
print("Saved to DR_export.csv")
```

Then install pandas if needed: `pip install pandas`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Empty list `[]` | Row Level Security is blocking the anon key. Use the service_role key instead, or temporarily disable RLS on the table. |
| Auth / 401 errors | Wrong URL or key. Re-copy them from the Connect panel. |
| Table name issues | The table is named `DR` (uppercase). Keep the quotes in the script as `"DR"`. |

Done. After filling in your URL and key, `python pull_dr.py` prints the table contents.
