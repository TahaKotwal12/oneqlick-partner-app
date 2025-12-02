# PowerShell script to get SHA-1 fingerprint for OneQlick app
# Run this script in PowerShell: .\get-sha1.ps1

Write-Host "Getting SHA-1 Fingerprint for OneQlick App" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Check if keytool exists
$keytoolPath = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytoolPath) {
    Write-Host "keytool not found. Please install Java JDK first." -ForegroundColor Red
    Write-Host "Download from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    exit 1
}

# Get SHA-1 fingerprint
Write-Host "Getting SHA-1 fingerprint from debug keystore..." -ForegroundColor Cyan
Write-Host ""

try {
    $debugKeystore = "$env:USERPROFILE\.android\debug.keystore"
    
    if (-not (Test-Path $debugKeystore)) {
        Write-Host "Debug keystore not found at: $debugKeystore" -ForegroundColor Red
        Write-Host "Please run 'npx expo run:android' first to generate the keystore." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Steps to generate keystore:" -ForegroundColor Cyan
        Write-Host "1. Run: npx expo run:android" -ForegroundColor White
        Write-Host "2. Wait for the build to complete" -ForegroundColor White
        Write-Host "3. Run this script again" -ForegroundColor White
        exit 1
    }
    
    # Run keytool command
    $result = & keytool -list -v -keystore $debugKeystore -alias androiddebugkey -storepass android -keypass android 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host $result
        Write-Host ""
        Write-Host "Copy the SHA1 fingerprint above and use it in Google Cloud Console" -ForegroundColor Green
        Write-Host "Package name: com.oneqlick.fooddelivery" -ForegroundColor Blue
        Write-Host "Google Cloud Console: https://console.cloud.google.com/" -ForegroundColor Blue
    } else {
        Write-Host "Error running keytool command" -ForegroundColor Red
        Write-Host $result
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
