@echo off
echo ===================================================
echo        ETS PRODUCTION DATABASE MIGRATION TOOL
echo ===================================================
echo.
echo This script will configure your Vercel/Production database.
echo Ensure you have 'psycopg2-binary' installed (pip install psycopg2-binary).
echo.
echo Please enter your PostgreSQL Database URL (from Vercel/Neon/Supabase)
echo Example: postgres://user:password@host:port/dbname?sslmode=require
echo.
set /p DATABASE_URL="Database URL: "

if "%DATABASE_URL%"=="" goto error

echo.
echo Setting TEMPORARY environment variable for this session...
set "DATABASE_URL=%DATABASE_URL%"

echo.
echo Running migrations against production database...
python manage.py migrate

if %ERRORLEVEL% NEQ 0 goto error_migrate

echo.
echo Creating superuser (default: admin / admin1234)...
python create_production_admin.py

if %ERRORLEVEL% NEQ 0 goto error_admin

echo.
echo ===================================================
echo        SUCCESS! Database is ready for Vercel.
echo ===================================================
pause
exit /b 0

:error
echo Error: Database URL is required.
pause
exit /b 1

:error_migrate
echo Error: MIGRATION FAILED. Check your URL and connection.
pause
exit /b 1

:error_admin
echo Error: ADMIN CREATION FAILED.
pause
exit /b 1
