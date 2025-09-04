#!/usr/bin/env python3
"""
Script de test pour vérifier la configuration d'IndraOS Backend
"""

import sys
import os

def test_imports():
    """Test des imports essentiels"""
    print("🔍 Test des imports...")
    
    try:
        import fastapi
        print("✅ FastAPI importé avec succès")
    except ImportError as e:
        print(f"❌ Erreur import FastAPI: {e}")
        return False
    
    try:
        import sqlalchemy
        print("✅ SQLAlchemy importé avec succès")
    except ImportError as e:
        print(f"❌ Erreur import SQLAlchemy: {e}")
        return False
    
    try:
        import psutil
        print("✅ psutil importé avec succès")
    except ImportError as e:
        print(f"❌ Erreur import psutil: {e}")
        return False
    
    try:
        import jose
        print("✅ python-jose importé avec succès")
    except ImportError as e:
        print(f"❌ Erreur import python-jose: {e}")
        return False
    
    try:
        import passlib
        print("✅ passlib importé avec succès")
    except ImportError as e:
        print(f"❌ Erreur import passlib: {e}")
        return False
    
    return True

def test_config():
    """Test de la configuration"""
    print("\n🔧 Test de la configuration...")
    
    try:
        from core.config import settings
        print("✅ Configuration chargée avec succès")
        print(f"   - API Title: {settings.api_title}")
        print(f"   - Version: {settings.api_version}")
        print(f"   - Port: {settings.port}")
        print(f"   - Debug: {settings.debug}")
        return True
    except Exception as e:
        print(f"❌ Erreur configuration: {e}")
        return False

def test_database():
    """Test de la base de données"""
    print("\n🗄️ Test de la base de données...")
    
    try:
        from db import engine, Base
        print("✅ Connexion base de données établie")
        
        # Test de création des tables
        Base.metadata.create_all(bind=engine)
        print("✅ Tables créées avec succès")
        return True
    except Exception as e:
        print(f"❌ Erreur base de données: {e}")
        return False

def test_services():
    """Test des services"""
    print("\n⚙️ Test des services...")
    
    try:
        from services import SystemService, ProcessService, UserService
        print("✅ Services importés avec succès")
        return True
    except Exception as e:
        print(f"❌ Erreur services: {e}")
        return False

def test_api():
    """Test de l'API"""
    print("\n🌐 Test de l'API...")
    
    try:
        from main import app
        print("✅ Application FastAPI créée avec succès")
        
        # Vérifier les routes
        routes = [route.path for route in app.routes]
        print(f"   - Routes disponibles: {len(routes)}")
        for route in routes[:5]:  # Afficher les 5 premières routes
            print(f"     * {route}")
        return True
    except Exception as e:
        print(f"❌ Erreur API: {e}")
        return False

def main():
    """Fonction principale de test"""
    print("🚀 Test de configuration IndraOS Backend")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_config,
        test_database,
        test_services,
        test_api
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Résultats: {passed}/{total} tests réussis")
    
    if passed == total:
        print("🎉 Tous les tests sont passés ! Le backend est prêt.")
        print("\n🚀 Pour démarrer le serveur:")
        print("   python run.py")
        print("   ou")
        print("   uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
    else:
        print("⚠️  Certains tests ont échoué. Vérifiez la configuration.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
