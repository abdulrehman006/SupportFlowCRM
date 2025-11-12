# Create SupportFlowCRM Database
Write-Host "Creating SupportFlowCRM Database..." -ForegroundColor Cyan
Write-Host ""

# Set password environment variable
$env:PGPASSWORD = "postgres"

try {
    # Create the database
    & "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost -p 5433 supportflowcrm 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database 'supportflowcrm' created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Run: npx prisma db push" -ForegroundColor White
        Write-Host "2. Run: npm run db:seed" -ForegroundColor White
        Write-Host "3. Run: npm run dev" -ForegroundColor White
    } else {
        Write-Host "✗ Database already exists or there was an error." -ForegroundColor Yellow
        Write-Host "  This is fine if the database was already created." -ForegroundColor Gray
    }
} catch {
    Write-Host "Error occurred" -ForegroundColor Red
} finally {
    # Clear password
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
