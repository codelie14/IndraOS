# Script PowerShell pour démarrer IndraOS Backend
# Exécuter en tant qu'administrateur pour les métriques système

Write-Host "🚀 Démarrage d'IndraOS Backend..." -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan

# Vérifier si Python est installé
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python détecté: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "Veuillez installer Python 3.8+ et l'ajouter au PATH" -ForegroundColor Yellow
    exit 1
}

# Vérifier si l'environnement virtuel existe
if (Test-Path "venv") {
    Write-Host "✅ Environnement virtuel détecté" -ForegroundColor Green
    
    # Activer l'environnement virtuel
    Write-Host "🔧 Activation de l'environnement virtuel..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'activation de l'environnement virtuel" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  Environnement virtuel non trouvé" -ForegroundColor Yellow
    Write-Host "🔧 Création de l'environnement virtuel..." -ForegroundColor Yellow
    
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de la création de l'environnement virtuel" -ForegroundColor Red
        exit 1
    }
    
    # Activer l'environnement virtuel
    & "venv\Scripts\Activate.ps1"
}

# Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green

# Test de la configuration
Write-Host "🧪 Test de la configuration..." -ForegroundColor Yellow
python test_setup.py

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests de configuration échoués" -ForegroundColor Red
    Write-Host "Vérifiez la configuration et réessayez" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Configuration validée" -ForegroundColor Green

# Démarrer le serveur
Write-Host "🌐 Démarrage du serveur..." -ForegroundColor Yellow
Write-Host "📊 API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "💚 Health Check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

# Démarrer avec uvicorn
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
