@echo off
echo Creating SupportFlowCRM Database...
echo.

REM Set password as environment variable
set PGPASSWORD=postgres

REM Create the database
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost -p 5433 supportflowcrm

if %errorlevel% equ 0 (
    echo.
    echo ✓ Database 'supportflowcrm' created successfully!
    echo.
) else (
    echo.
    echo ✗ Failed to create database. It may already exist or there's a connection issue.
    echo.
)

REM Clear password from environment
set PGPASSWORD=

pause
