# IndraOS Backend

Backend FastAPI pour IndraOS - Système d'exploitation intelligent

## 🚀 Fonctionnalités

- **API REST complète** avec FastAPI
- **Authentification JWT** sécurisée
- **Base de données SQLite** avec SQLAlchemy
- **Métriques système en temps réel** (CPU, mémoire, disque, réseau)
- **Gestion des processus** système
- **Gestion des services** système
- **Surveillance réseau** et interfaces
- **Événements de sécurité** et alertes
- **Documentation automatique** avec Swagger/OpenAPI

## 📋 Prérequis

- Python 3.8+
- pip
- Accès administrateur pour les métriques système

## 🛠️ Installation

1. **Créer un environnement virtuel :**
```bash
python -m venv venv
```

2. **Activer l'environnement virtuel :**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Installer les dépendances :**
```bash
pip install -r requirements.txt
```

## ⚙️ Configuration

1. **Copier le fichier de configuration :**
```bash
cp config.env .env
```

2. **Modifier le fichier .env selon vos besoins :**
```env
DEBUG=true
SECRET_KEY=votre-cle-secrete-ici
DATABASE_URL=sqlite:///./indraos.db
```

## 🚀 Démarrage

### Option 1 : Script de démarrage
```bash
python run.py
```

### Option 2 : Uvicorn directement
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3 : Module Python
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 🌐 Accès

- **API Base URL :** http://localhost:8000
- **Documentation Swagger :** http://localhost:8000/docs
- **Documentation ReDoc :** http://localhost:8000/redoc
- **Health Check :** http://localhost:8000/health

## 📚 Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/me` - Informations utilisateur actuel

### Système
- `GET /api/system` - Informations système de base
- `GET /api/system/overview` - Vue d'ensemble complète
- `GET /api/system/metrics` - Historique des métriques
- `GET /api/system/metrics/latest` - Dernières métriques
- `POST /api/system/metrics/collect` - Collecter les métriques

### Processus
- `GET /api/processes` - Liste des processus
- `GET /api/processes/sync` - Synchroniser les processus
- `GET /api/processes/{pid}` - Détails d'un processus
- `DELETE /api/processes/{pid}` - Tuer un processus

### Services
- `GET /api/services` - Liste des services système

### Réseau
- `GET /api/network/interfaces` - Interfaces réseau

### Sécurité
- `GET /api/security/events` - Événements de sécurité

## 🔐 Authentification

L'API utilise l'authentification JWT. Pour accéder aux endpoints protégés :

1. **Obtenir un token :**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=votre_utilisateur&password=votre_mot_de_passe"
```

2. **Utiliser le token :**
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer votre_token_jwt"
```

## 🗄️ Base de données

La base de données SQLite est créée automatiquement au premier démarrage. Les tables incluent :

- `users` - Utilisateurs et authentification
- `system_metrics` - Métriques système historiques
- `processes` - Processus système
- `services` - Services système
- `network_interfaces` - Interfaces réseau
- `security_events` - Événements de sécurité

## 📊 Métriques collectées

- **CPU :** Utilisation, température, fréquence
- **Mémoire :** Utilisation, disponible, totale
- **Disque :** Utilisation, disponible, totale
- **Réseau :** Octets reçus/envoyés
- **Système :** Statut, uptime

## 🧪 Tests

```bash
# Lancer les tests
pytest

# Avec couverture
pytest --cov=backend
```

## 📝 Logs

Les logs sont configurés dans `config.env` :
- `LOG_LEVEL` : Niveau de log (DEBUG, INFO, WARNING, ERROR)
- `LOG_FILE` : Fichier de log

## 🔧 Développement

### Structure du projet
```
backend/
├── api/           # Endpoints API
├── core/          # Configuration
├── db/            # Base de données
├── models/        # Modèles SQLAlchemy
├── services/      # Logique métier
├── tests/         # Tests
├── main.py        # Point d'entrée
└── requirements.txt
```

### Ajouter un nouvel endpoint

1. Créer le schéma dans `api/schemas/`
2. Créer le service dans `services/`
3. Créer l'endpoint dans `api/endpoints/`
4. Inclure le router dans `main.py`

## 🚨 Dépannage

### Erreur de port déjà utilisé
```bash
# Vérifier les processus utilisant le port 8000
netstat -ano | findstr :8000

# Tuer le processus
taskkill /PID <PID> /F
```

### Erreur de dépendances
```bash
# Mettre à jour pip
python -m pip install --upgrade pip

# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall
```

### Erreur de permissions
- Exécuter en tant qu'administrateur sur Windows
- Utiliser `sudo` sur Linux/Mac

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs du serveur
2. Consulter la documentation API
3. Vérifier la configuration dans `.env`

## 📄 Licence

Ce projet fait partie d'IndraOS et est sous licence propriétaire.
