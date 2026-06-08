# NalarPath AI — Backend Runner Script
# Jalankan file ini dari PowerShell:
#   cd "c:\SMT4\AI\project-ai-matkul\Project\backend"
#   .\run_backend.ps1

$PythonExe = "C:\Users\HP\AppData\Local\Python\bin\python3.exe"
$BackendDir = $PSScriptRoot

Write-Host "=== NalarPath AI Backend v0.3.0 (Hybrid Rule-Based + ML) ===" -ForegroundColor Cyan
Write-Host "Python : $PythonExe" -ForegroundColor Gray
Write-Host "Dir    : $BackendDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Server : http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Docs   : http://127.0.0.1:8000/docs  (Swagger UI)" -ForegroundColor Green
Write-Host "ReDoc  : http://127.0.0.1:8000/redoc" -ForegroundColor Green
Write-Host ""
Write-Host "Tekan Ctrl+C untuk stop." -ForegroundColor Yellow
Write-Host "──────────────────────────────────────────" -ForegroundColor DarkGray

Set-Location $BackendDir
& $PythonExe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
