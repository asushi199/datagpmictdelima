# Project Guidance

## Context
- This project is for PPD Manjung USTP work.
- Public-facing copy should default to Malay.
- Keep the site lightweight: public directory, simple submission form, and password-only admin.

## Safety
- Do not commit secrets or local passwords.
- Do not commit raw Excel/PDF source files that may contain IC numbers or personal data.
- Do not commit generated real-data seed files unless the user explicitly confirms the data is safe for GitHub.
- `database_password.txt` is local only and must stay ignored.

## Development
- The project path contains `&`, so Windows `npm run` may fail.
- Prefer the PowerShell wrappers:
  - `.\scripts\dev.ps1`
  - `.\scripts\test.ps1`
  - `.\scripts\build.ps1`
- Use `node .\scripts\import-initial-data.mjs` locally to regenerate data from the Excel file.

## Scope
- V1 has no teacher login, no school PIN, and no approval workflow.
- Admin access uses `ADMIN_PASSWORD` from environment variables.
- Supabase service role access must only be used server-side.
