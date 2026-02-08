# Production Setup Guide (Vercel + PostgreSQL)

## 1. Get a PostgreSQL Database (Free)
We recommend **Neon.tech** as it is the easiest to set up.

1.  Go to [Neon.tech](https://neon.tech) and Sign Up.
2.  Click **"Create Project"**.
3.  Name it `locks-step-db` (or anything you like).
4.  **IMPORTANT:** When the dashboard loads, look for the **Connection Details** section.
5.  Copy the **Connection String** (it starts with `postgres://...`).
    *   *Make sure "Pooled connection" check box is checked if available, but standard is fine too.*
    *   It looks like: `postgres://neondb_owner:AbC123...@ep-cool-fog.aws.neon.tech/neondb?sslmode=require`

## 2. Configure Local Connection (Test & Setup)
1.  Open your terminal in VS Code.
2.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
3.  Run the helper script:
    ```bash
    .\migrate_production.bat
    ```
4.  Paste the **Connection String** when asked.
    *   *This will create all the necessary tables in your new online database.*
    *   *It will also create the `admin` user.*

## 3. Configure Vercel (Production)
1.  Go to your Vercel Project Dashboard.
2.  Click **Settings** -> **Environment Variables**.
3.  Add the following variables:
    *   `DATABASE_URL`: (Paste the same Connection String)
    *   `SECRET_KEY`: (Type a long random string, e.g., `django-insecure-random-string-123`)
    *   `DEBUG`: `False`
    *   `ALLOWED_HOSTS`: `.vercel.app,localhost,127.0.0.1`

## 4. Deploy
1.  Push your latest code to GitHub.
2.  Vercel will automatically redeploy.
3.  Your app is now live and connected to the database!
