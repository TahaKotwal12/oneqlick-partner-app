# PowerShell script to get SHA-1 fingerprint using Gradle (No Java JDK required!)
# Run this script in PowerShell: .\get-sha1-gradle.ps1

Write-Host "Getting SHA-1 Fingerprint using Gradle" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Check if android folder exists
$androidPath = ".\android"
if (-not (Test-Path $androidPath)) {
    Write-Host "Android folder not found!" -ForegroundColor Red
    Write-Host "You need to build the Android project first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run this command first:" -ForegroundColor Cyan
    Write-Host "  npx expo prebuild --platform android" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Navigate to android folder
Write-Host "Navigating to android folder..." -ForegroundColor Cyan
Set-Location $androidPath

# Check if gradlew exists
if (-not (Test-Path ".\gradlew.bat")) {
    Write-Host "gradlew.bat not found!" -ForegroundColor Red
    Write-Host "Please run 'npx expo prebuild --platform android' first." -ForegroundColor Yellow
    Set-Location ..
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Run gradle signing report
Write-Host "Running Gradle signing report..." -ForegroundColor Cyan
Write-Host "This may take a minute..." -ForegroundColor Yellow
Write-Host ""

try {
    $output = & .\gradlew.bat signingReport 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        # Filter and display only the relevant SHA-1 information
        $inDebugSection = $false
        $foundSHA1 = $false
        
        foreach ($line in $output) {
            if ($line -match "Variant: debug") {
                $inDebugSection = $true
                Write-Host "=== DEBUG KEYSTORE ===" -ForegroundColor Green
            }
            
            if ($inDebugSection) {
                if ($line -match "SHA1:") {
                    Write-Host $line -ForegroundColor Yellow
                    $foundSHA1 = $true
                }
                if ($line -match "SHA-256:") {
                    Write-Host $line -ForegroundColor Cyan
                }
                if ($line -match "Valid until:") {
                    Write-Host $line -ForegroundColor White
                    $inDebugSection = $false
                }
            }
        }
        
        if ($foundSHA1) {
            Write-Host ""
            Write-Host "✅ SUCCESS!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "1. Copy the SHA1 fingerprint above" -ForegroundColor White
            Write-Host "2. Go to: https://console.cloud.google.com/apis/credentials" -ForegroundColor White
            Write-Host "3. Create OAuth 2.0 Client ID → Android" -ForegroundColor White
            Write-Host "4. Package name: com.oneqlick.partner" -ForegroundColor White
            Write-Host "5. Paste the SHA-1 fingerprint" -ForegroundColor White
        } else {
            Write-Host "Could not find SHA-1 in output. Full output:" -ForegroundColor Yellow
            Write-Host $output
        }
    } else {
        Write-Host "Error running Gradle command" -ForegroundColor Red
        Write-Host $output
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Return to parent directory
    Set-Location ..
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
